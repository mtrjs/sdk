import { Eid } from './constant';
import { IData, IPlugin, ReportParams, Sender } from '../core/type';
import Reporter from '../core/reporter';
import { Task } from '../core/scheduler';
import { onFCP, onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

export class Browser implements IPlugin {
  name = 'Browser';

  client!: Reporter;

  apply(client: Reporter) {
    this.client = client;

    if (!window && !document) return;

    client.$hook.on('init', () => {
      this.timing();
    });

    client.$hook.on('send', (report: (s: Sender) => Promise<any>) => {
      requestIdleCallback(() => report(this.send.bind(this)));
    });

    // 特殊处理, 刷新或者离开页面前保证缓存的数据能够上报
    document.addEventListener('visibilitychange', () => {
      const tasks = client.getTasks();
      if (!tasks.length) return;
      const data = tasks.map(({ data }: Task) => data);
      this.send(data, true);
    });
  }

  send(data: IData[], sync = false) {
    const { url, method } = this.client.getReportParams();
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (typeof navigator.sendBeacon === 'function') {
      return Promise.resolve(navigator.sendBeacon(url, formData));
    }
    if (typeof fetch === 'function') {
      return fetch(url, { method, keepalive: true }).then(() => {
        return true;
      });
    }
    return new Promise<boolean>((r, j) => {
      const XHR = new XMLHttpRequest();
      XHR.addEventListener('load', function () {
        r(true);
      });
      XHR.addEventListener('error', function () {
        j();
      });
      XHR.open(method, url, !sync);
      XHR.send(formData);
    });
  }

  report(body: ReportParams) {
    const { data } = body;

    const { eid, l } = data;
    const ua = navigator.userAgent;

    this.client?.$hook.emit('report', {
      ...body,
      data: {
        eid,
        l: {
          ...l,
          ua,
          href: window.location.href,
        },
      },
    });
  }

  timing() {
    if (PerformanceObserver) {
      const observeTiming: Record<string, null | number> = {
        fcp: 0,
        lcp: 0,
        cls: null,
        ttfb: 0,
      };

      const navigationP = new Promise<PerformanceTiming>((r) => {
        const perfObserver = (entries: PerformanceObserverEntryList) => {
          entries.getEntries().forEach((entry) => {
            const { entryType } = entry;
            if (entryType === 'navigation') {
              const t = entry.toJSON();
              r(t);
            }
          });
        };
        const observer = new PerformanceObserver(perfObserver);
        observer.observe({ entryTypes: ['navigation'] });
      });

      let loadPromiseUnLock = () => {};
      const loadPromise = new Promise<void>((r) => {
        loadPromiseUnLock = r;
      });

      onLCP(
        (metric) => {
          observeTiming.lcp = metric.value;
        },
        {
          reportAllChanges: true,
        },
      );

      const fcpP = new Promise<void>((r) => {
        onFCP((metric) => {
          observeTiming.fcp = metric.value;
          r();
        });
      });

      onCLS(
        (metric) => {
          observeTiming.cls = metric.value;
        },
        { reportAllChanges: true },
      );

      let fid: number | undefined;

      onFID((metric) => {
        fid = metric.value;
      });

      const ttfbP = new Promise<void>((r) => {
        onTTFB((metric) => {
          observeTiming.ttfb = metric.value;
          r();
        });
      });

      setTimeout(() => {
        loadPromiseUnLock();
      }, 12000);

      window.addEventListener('load', () => {
        loadPromiseUnLock();
      });

      Promise.all([navigationP, loadPromise, fcpP, ttfbP]).then(([navigation]) => {
        const { lcp, fcp, ttfb, cls } = observeTiming;
        this.report({
          runTime: 'immediately',
          data: {
            eid: Eid.performance,
            l: {
              ...navigation,
              lcp: lcp && Number(lcp.toFixed(2)),
              fcp: fcp && Number(fcp.toFixed(2)),
              fid: fid && Number(fid.toFixed(2)),
              cls: cls && Number(cls.toFixed(2)),
              ttfb: ttfb && Number(ttfb.toFixed(2)),
              version: 'v2',
            },
          },
        });
      });
    } else {
      window.addEventListener('load', () => {
        const { navigationStart, unloadEventStart } = performance.timing;
        const { redirectCount } = performance.navigation;
        const startAt = Math.min(navigationStart, unloadEventStart) || 0;

        const originTiming: Record<string, any> = {
          ...performance.timing,
          ...performance.navigation,
        };

        const timing: Record<string, any> = {
          redirectCount,
        };

        this.report({
          runTime: 'immediately',
          data: { eid: Eid.performance, l: { ...timing, ...originTiming, version: 'v1' } },
        });
      });
    }
  }
}

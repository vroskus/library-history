/* eslint-disable class-methods-use-this */
// Global Types
import type {
  $Location,
  $WebRouter,
} from '@vroskus/library-types';

import * as React from 'react';
import {
  withRouter,
} from 'react-router-dom';

// Types
import type {
  ReactNode,
} from 'react';

type $Listener = (location: $Location) => unknown;

type $Props = $WebRouter;

let globalHistory = null;
const listeners: Array<$Listener> = [];

class Spy extends React.Component<$Props> {
  componentDidMount(): void {
    this.trackHistoryChange();
  }

  componentDidUpdate(): void {
    this.trackHistoryChange();
  }

  trackHistoryChange(): void {
    const {
      history,
    } = this.props;

    listeners.forEach((listener: $Listener) => {
      listener(history.location);
    });

    globalHistory = history;
  }

  render(): null {
    return null;
  }
}

export type $RedirectParams = {
  hash?: string;
  pathname?: string;
  search?: string;
  state?: object;
};
export type $RedirectResponse = $RedirectParams;

export type $HistoryService = {
  readonly addListener: (listener: $Listener) => number;
  readonly getCurrentPathname: () => string | null;
  readonly redirect: (arg0: $RedirectParams) => $RedirectResponse;
  readonly render: ReactNode;
};

const HistoryService: $HistoryService = {
  addListener: (listener: $Listener) => listeners.push(listener),
  getCurrentPathname: () => {
    if (window && window.location) {
      return window.location.pathname || null;
    }

    return null;
  },
  redirect: (params: $RedirectParams): $RedirectResponse => {
    if (globalHistory) {
      globalHistory.push(params);
    }

    return params;
  },
  render: withRouter(Spy) as unknown as ReactNode,
};

export default HistoryService;

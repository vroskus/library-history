/* eslint-disable class-methods-use-this,perfectionist/sort-modules */

// Global Types
import type {
  History,
} from 'history';

// Global Components
import * as React from 'react';
import {
  withRouter,
} from 'react-router-dom';

// Types
import type {
  $Location,
  $WebRouter,
} from './types';

export * from './types';

type $Listener = (location: $Location) => unknown;

type $Props = $WebRouter;

let globalHistory: History<unknown> | null = null;
const listeners: Array<$Listener> = [];

export type $RedirectParams = {
  hash?: string;
  pathname?: string;
  search?: string;
  state?: object;
};

export type $HistoryService = {
  readonly addListener: (listener: $Listener) => number;
  readonly getCurrentPathname: () => null | string;
  readonly redirect: (arg0: $RedirectParams) => $RedirectParams;
  readonly render: typeof React.Component;
};

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

const HistoryService: $HistoryService = {
  addListener: (
    listener: $Listener,
  ) => listeners.push(listener),
  getCurrentPathname: () => {
    if (window && window.location) {
      return window.location.pathname || null;
    }

    return null;
  },
  redirect: (
    params: $RedirectParams,
  ): $RedirectParams => {
    if (globalHistory) {
      globalHistory.push(params);
    }

    return params;
  },
  render: withRouter(Spy) as typeof React.Component,
};

export default HistoryService;

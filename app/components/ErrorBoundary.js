// @flow
import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import HelpText from 'components/HelpText';
import Button from 'components/Button';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import { githubIssuesUrl } from '../../shared/utils/routeHelpers';

type Props = {
  children: React.Node,
};

@observer
class ErrorBoundary extends React.Component<Props> {
  @observable error: ?Error;
  @observable showDetails: boolean = false;

  componentDidCatch(error: Error, info: Object) {
    this.error = error;

    // Error handler is often blocked by the browser
    if (window.Bugsnag) {
      Bugsnag.notifyException(error, { react: info });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleShowDetails = () => {
    this.showDetails = true;
  };

  handleReportBug = () => {
    window.open(githubIssuesUrl());
  };

  render() {
    if (this.error) {
      const isReported = !!window.Bugsnag;

      return (
        <CenteredContent>
          <PageTitle title="Something Unexpected Happened" />
          <h1>Something Unexpected Happened</h1>
          <HelpText>
            Sorry, an unrecoverable error occurred{isReported &&
              ' – our engineers have been notified'}. Please try reloading the
            page, it may have been a temporary glitch.
          </HelpText>
          {this.showDetails && <Pre>{this.error.toString()}</Pre>}
          <p>
            <Button onClick={this.handleReload}>Reload</Button>{' '}
            {this.showDetails ? (
              <Button onClick={this.handleReportBug} light>
                Report a Bug…
              </Button>
            ) : (
              <Button onClick={this.handleShowDetails} light>
                Show Details…
              </Button>
            )}
          </p>
        </CenteredContent>
      );
    }
    return this.props.children;
  }
}

const Pre = styled.pre`
  background: ${props => props.theme.smoke};
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
`;

export default ErrorBoundary;

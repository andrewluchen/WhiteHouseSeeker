import React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

class BillTrackerStepper extends React.Component {

  renderIntroduced(firstLocation) {
    if (firstLocation === 'senate') {
      return (
        <Stepper activeStep={0}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed House</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'house') {
      return (
        <Stepper activeStep={0}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed House</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    }
  }

  renderFloor(firstLocation, floorLocation) {
    if (firstLocation === 'senate' && floorLocation === 'senate') {
      return (
        <Stepper activeStep={1}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>In the Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed House</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'house' && floorLocation === 'house') {
      return (
        <Stepper activeStep={1}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>In the House</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'senate' && floorLocation === 'house') {
      return (
        <Stepper activeStep={2}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>In the House</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'house' && floorLocation === 'senate') {
      return (
        <Stepper activeStep={2}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed House</StepLabel>
          </Step>
          <Step>
            <StepLabel>In the Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>To President</StepLabel>
          </Step>
          <Step>
            <StepLabel>Became Law</StepLabel>
          </Step>
        </Stepper>
      );
    }
  }

  renderFailedAt(firstLocation, failLocation) {
    if (firstLocation === 'senate' && failLocation === 'senate') {
      return (
        <Stepper activeStep={1}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Failed Senate</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'house' && failLocation === 'house') {
      return (
        <Stepper activeStep={1}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Failed House</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'senate' && failLocation === 'house') {
      return (
        <Stepper activeStep={2}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed Senate</StepLabel>
          </Step>
          <Step>
            <StepLabel>Failed House</StepLabel>
          </Step>
        </Stepper>
      );
    } else if (firstLocation === 'house' && failLocation === 'senate') {
      return (
        <Stepper activeStep={2}>
          <Step>
            <StepLabel>Introduced</StepLabel>
          </Step>
          <Step>
            <StepLabel>Passed House</StepLabel>
          </Step>
          <Step>
            <StepLabel>Failed Senate</StepLabel>
          </Step>
        </Stepper>
      );
    }
  }

  render() {
    let versions = this.props.versions;
    if (versions.length === 0) {
      return this.renderIntroduced('house');
    }
    let firstLocation = versions[0].location;
    if (versions.length === 1 && versions[0].status === 'Introduced') {
      return this.renderIntroduced(firstLocation);
    }
    let secondStatus = versions[1].status;
    if (secondStatus === 'In Debate' || secondStatus === 'In Vote') {
      return this.renderFloor(firstLocation, firstLocation);
    }
    if (secondStatus === 'Failed') {
      return this.renderFailedAt(firstLocation, versions[1].location);
    }
    let thirdStatus = versions[2].status;
    if (
      thirdStatus.indexOf('Received') !== -1 ||
      thirdStatus === 'In Debate' ||
      thirdStatus === 'In Vote'
    ) {
      return this.renderFloor(firstLocation, versions[2].location);
    }
    if (thirdStatus === 'Failed') {
      return this.renderFailedAt(firstLocation, versions[2].location);
    }
    let fourthStatus = versions[3].status;
    if (thirdStatus.indexOf('Presented') !== -1) {
      return this.renderPotusDesk(firstLocation);
    }
    return <div>Something went wrong!</div>;
  }
}

BillTrackerStepper.propTypes = {
  versions: React.PropTypes.array,
};

export default BillTrackerStepper;

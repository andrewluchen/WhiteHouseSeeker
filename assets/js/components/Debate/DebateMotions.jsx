import React from 'react';

import { UNANIMOUS, AMEND, CLOTURE, REFER, TABLE } from './DebateConstants';
import MotionUnanimous from './MotionUnanimous';
import MotionAmend from './MotionAmend';
import MotionCloture from './MotionCloture';
import MotionRefer from './MotionRefer';
import MotionTable from './MotionTable';

class DebateMotions extends React.Component {

  render() {
    let motions = [];
    this.props.motions.forEach(motion => {
      let component = null;
      switch (motion.motion_type) {
        case UNANIMOUS:
          component = <MotionUnanimous motion={motion}/>;
          break;
        case AMEND:
          component = <MotionAmend motion={motion}/>;
          break;
        case CLOTURE:
          component = <MotionCloture motion={motion}/>;
          break;
        case REFER:
          component = <MotionRefer motion={motion}/>;
          break;
        case TABLE:
          component = <MotionTable motion={motion}/>;
          break;
      }
      motions.push(
        <div key={motion.id}>
          {component}
        </div>
      );
    });
    return (
      <div>{motions}</div>
    );
  }
}

DebateMotions.propTypes = {
  motions: React.PropTypes.array,
};

export default DebateMotions;

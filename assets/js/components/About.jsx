import React from 'react';

class About extends React.Component {

  render() {
    return (
      <div>
        A project inspired by Senate Seeker and USGS.<br/>
        &copy; 2016 Andrew Chen. Released under GPLv3 License.<br/>
        Source code hosted on <a href="https://github.com/andrewluchen/WhiteHouseSeeker">Github</a>.<br/><br/>

        <a href="https://github.com/andrewluchen/WhiteHouseSeeker/issues">Report Bug</a><br/>
        Please include:<br/>
        (1) Detailed description<br/>
        (2) Reproduction steps (redo your actions that caused the bug)<br/>
        (3) Screenshot of what the bug looks like<br/>
      </div>
    );
  }
}

export default About;

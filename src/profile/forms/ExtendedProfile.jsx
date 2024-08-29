import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import JobTitle from './JobTitle';

import { profilePageSelector } from '../data/selectors';
import Profession from './Profession';

class ExtendedProfile extends React.Component {
  constructor(props) {
    super(props);

    this.handleExtendedChange = this.handleExtendedChange.bind(this);
  }

  handleExtendedChange(name, value) {
    const extendedProfile = [...this.props.extendedProfile];
    // console.log(name, value);
    extendedProfile[extendedProfile.findIndex((field) => field.fieldName === name)] = {
      fieldName: name,
      fieldValue: value,
    };
    this.props.changeHandler('extendedProfile', extendedProfile);
  }

  render() {
    const {
      extendedProfile, visibility, ...commonFormProps
    } = this.props;

    const extendedProfileFieldsObjects = extendedProfile.reduce((acc, { fieldName, fieldValue }) => {
      acc[fieldName] = fieldValue;
      return acc;
    }, {});

    console.log(visibility);

    return (
      <div>
        {extendedProfileFieldsObjects.job_title
          && (
            <JobTitle
              jobTitle={extendedProfileFieldsObjects.job_title}
              visibilityJobTitle={visibility.jobTitle}
              formId="job_title"
              handleExtendedChange={this.handleExtendedChange}
              {...commonFormProps}
            />
          )}
        {extendedProfileFieldsObjects.profession
          && (
            <Profession
              profession={extendedProfileFieldsObjects.profession}
              visibilityJobTitle={visibility.profession}
              formId="profession"
              handleExtendedChange={this.handleExtendedChange}
              {...commonFormProps}
            />
          )}
      </div>
    );
  }
}

ExtendedProfile.propTypes = {
  extendedProfile: PropTypes.arrayOf(PropTypes.shape({
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
  })),
  visibility: {},
  changeHandler: PropTypes.func.isRequired,
};

ExtendedProfile.defaultProps = {
  extendedProfile: [],
  visibility: {},
};

export default connect(
  profilePageSelector,
  {},
)(ExtendedProfile);

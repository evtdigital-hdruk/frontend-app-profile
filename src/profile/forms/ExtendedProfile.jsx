import React from 'react';
import PropTypes from 'prop-types';

import ExtendedProfileField from './ExtendedProfileField';
import jobTitleMessages from './JobTitle.messages';
import professionMessages from './Profession.messages';
import { JOB_TITLES, PROFESSION_CATEGORIES } from '../data/constants';

const ExtendedProfile = ({
  extendedProfile, visibility, changeHandler, ...commonFormProps
}) => {
  const handleExtendedChange = (name, value) => {
    const updatedProfile = [...extendedProfile];
    const index = updatedProfile.findIndex((field) => field.fieldName === name);
    const entry = { fieldName: name, fieldValue: value };
    if (index >= 0) {
      updatedProfile[index] = entry;
    } else {
      updatedProfile.push(entry);
    }
    changeHandler('extendedProfile', updatedProfile);
  };

  const fieldsByName = extendedProfile.reduce((acc, { fieldName, fieldValue }) => {
    acc[fieldName] = fieldValue;
    return acc;
  }, {});

  return (
    <div>
      {'job_title' in fieldsByName && (
        <ExtendedProfileField
          value={fieldsByName.job_title}
          visibility={visibility.jobTitle}
          visibilityId="visibilityJobTitle"
          formId="job_title"
          options={JOB_TITLES}
          messages={jobTitleMessages}
          titleMessageKey="profile.jobTitle.title"
          optionMessagePrefix="profile.jobTitle.titles"
          fallbackMessageKey="profile.jobTitle.titles.other"
          emptyMessageId="profile.jobTitle.empty"
          emptyMessageDefault="Add your job title"
          emptyMessageDescription="instructions when the user hasn't added a job title"
          handleExtendedChange={handleExtendedChange}
          changeHandler={changeHandler}
          {...commonFormProps}
        />
      )}
      {'profession' in fieldsByName && (
        <ExtendedProfileField
          value={fieldsByName.profession}
          visibility={visibility.profession}
          visibilityId="visibilityProfession"
          formId="profession"
          options={PROFESSION_CATEGORIES}
          messages={professionMessages}
          titleMessageKey="profile.profession.title"
          optionMessagePrefix="profile.profession"
          fallbackMessageKey="profile.profession.other"
          emptyMessageId="profile.profession.empty"
          emptyMessageDefault="Add your profession"
          emptyMessageDescription="instructions when the user hasn't added a profession"
          handleExtendedChange={handleExtendedChange}
          changeHandler={changeHandler}
          {...commonFormProps}
        />
      )}
    </div>
  );
};

ExtendedProfile.propTypes = {
  extendedProfile: PropTypes.arrayOf(PropTypes.shape({
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
  })),
  visibility: PropTypes.shape({
    profession: PropTypes.string,
    jobTitle: PropTypes.string,
  }),
  changeHandler: PropTypes.func.isRequired,
};

ExtendedProfile.defaultProps = {
  extendedProfile: [],
  visibility: {},
};

export default ExtendedProfile;

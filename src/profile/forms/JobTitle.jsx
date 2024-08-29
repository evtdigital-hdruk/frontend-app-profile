import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@edx/paragon';

import messages from './JobTitle.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';
import { JOB_TITLES } from '../data/constants';

class JobTitle extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleExtendedChange(e) {
    const { name, value } = e.target;
    this.props.handleExtendedChange(name, value);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    const {
      formId, jobTitle, visibilityJobTitle, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.jobTitle.title'])}
                  </label>
                  <select
                    data-hj-suppress
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={jobTitle}
                    onChange={this.handleExtendedChange}
                  >
                    {JOB_TITLES.map(title => (
                      <option
                        key={title}
                        value={intl.formatMessage(get(
                          messages,
                          `profile.jobTitle.titles.${title}`,
                        ))}
                      >
                        {intl.formatMessage(get(
                          messages,
                          `profile.jobTitle.titles.${title}`,
                          messages['profile.jobTitle.titles.other'],
                        ))}
                      </option>
                    ))}
                  </select>
                  {error !== null && (
                    <Form.Control.Feedback hasIcon={false}>
                      {error}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <FormControls
                  visibilityId="visibilityJobTitle"
                  saveState={saveState}
                  visibility={visibilityJobTitle}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.jobTitle.title'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityJobTitle !== null}
                visibility={visibilityJobTitle}
              />
              <p data-hj-suppress className="h5">{jobTitle}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.jobTitle.title'])} />
              <EmptyContent onClick={this.handleOpen}>
                <FormattedMessage
                  id="profile.jobTitle.empty"
                  defaultMessage="Add your job title"
                  description="instructions when the user hasn't added a job title"
                />
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.jobTitle.title'])} />
              <p data-hj-suppress className="lead">{jobTitle}</p>
            </>
          ),
        }}
      />
    );
  }
}

JobTitle.propTypes = {
  formId: PropTypes.string.isRequired,

  // From Selector
  jobTitle: PropTypes.string,
  visibilityJobTitle: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  handleExtendedChange: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

JobTitle.defaultProps = {
  editMode: 'static',
  saveState: null,
  jobTitle: null,
  visibilityJobTitle: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(JobTitle));

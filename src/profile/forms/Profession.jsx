import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@edx/paragon';

import messages from './Profession.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';
import { PROFESSION_CATEGORIES } from '../data/constants';

class Profession extends React.Component {
  constructor(props) {
    super(props);

    this.handleExtendedChange = this.handleExtendedChange.bind(this);
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
      formId, profession, visibilityProfession, editMode, saveState, error, intl,
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
                    {intl.formatMessage(messages['profile.profession.title'])}
                  </label>
                  <select
                    data-hj-suppress
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={profession}
                    onChange={this.handleExtendedChange}
                  >
                    {PROFESSION_CATEGORIES.map(prof => (
                      <option
                        key={prof}
                        value={intl.formatMessage(get(
                          messages,
                          `profile.profession.${prof}`,
                        ))}
                      >
                        {intl.formatMessage(get(
                          messages,
                          `profile.profession.${prof}`,
                          messages['profile.profession.other'],
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
                  visibilityId="visibilityProfession"
                  saveState={saveState}
                  visibility={visibilityProfession}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.profession.title'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityProfession !== null}
                visibility={visibilityProfession}
              />
              <p data-hj-suppress className="h5">{profession}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.profession.title'])} />
              <EmptyContent onClick={this.handleOpen}>
                <FormattedMessage
                  id="profile.profession.empty"
                  defaultMessage="Add your profession"
                  description="instructions when the user hasn't added a profession"
                />
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.profession.title'])} />
              <p data-hj-suppress className="lead">{profession}</p>
            </>
          ),
        }}
      />
    );
  }
}

Profession.propTypes = {
  formId: PropTypes.string.isRequired,

  // From Selector
  profession: PropTypes.string,
  visibilityProfession: PropTypes.oneOf(['private', 'all_users']),
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

Profession.defaultProps = {
  editMode: 'static',
  saveState: null,
  profession: null,
  visibilityProfession: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Profession));

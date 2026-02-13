import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@openedx/paragon';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { editableFormSelector } from '../data/selectors';

class ExtendedProfileField extends React.Component {
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
      formId, value, visibility, visibilityId, editMode, saveState, error, intl,
      options, messages, titleMessageKey, optionMessagePrefix, emptyMessageId, emptyMessageDefault,
      emptyMessageDescription, fallbackMessageKey,
    } = this.props;

    const title = intl.formatMessage(messages[titleMessageKey]);

    // Build option descriptors: each option key maps to its message descriptor
    // and its English defaultMessage (which the backend stores as the field value).
    const optionDescriptors = options.map((key) => {
      const descriptor = get(
        messages,
        `${optionMessagePrefix}.${key}`,
        messages[fallbackMessageKey],
      );
      return {
        key,
        backendValue: descriptor.defaultMessage,
        displayValue: intl.formatMessage(descriptor),
      };
    });

    // Reverse lookup: translate a backend value (English string) to the current locale.
    const translateValue = (val) => {
      const match = optionDescriptors.find((opt) => opt.backendValue === val);
      return match ? match.displayValue : val;
    };

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
                    {title}
                  </label>
                  <select
                    data-hj-suppress
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={value}
                    onChange={this.handleExtendedChange}
                  >
                    <option value="">&nbsp;</option>
                    {optionDescriptors.map(({ key, backendValue, displayValue }) => (
                      <option key={key} value={backendValue}>
                        {displayValue}
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
                  visibilityId={visibilityId}
                  saveState={saveState}
                  visibility={visibility}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={title}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibility !== null}
                visibility={visibility}
              />
              <p data-hj-suppress className="h5">{translateValue(value)}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={title} />
              <EmptyContent onClick={this.handleOpen}>
                <FormattedMessage
                  id={emptyMessageId}
                  defaultMessage={emptyMessageDefault}
                  description={emptyMessageDescription}
                />
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={title} />
              <p data-hj-suppress className="lead">{translateValue(value)}</p>
            </>
          ),
        }}
      />
    );
  }
}

ExtendedProfileField.propTypes = {
  formId: PropTypes.string.isRequired,

  // Field config
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  messages: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
  titleMessageKey: PropTypes.string.isRequired,
  optionMessagePrefix: PropTypes.string.isRequired,
  fallbackMessageKey: PropTypes.string.isRequired,
  emptyMessageId: PropTypes.string.isRequired,
  emptyMessageDefault: PropTypes.string.isRequired,
  emptyMessageDescription: PropTypes.string.isRequired,
  visibilityId: PropTypes.string.isRequired,

  // From Selector
  value: PropTypes.string,
  visibility: PropTypes.oneOf(['private', 'all_users']),
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

ExtendedProfileField.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: null,
  visibility: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(ExtendedProfileField));

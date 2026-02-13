import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import i18nMessages from '../../i18n';

import viewOwnProfileMockStore from '../__mocks__/viewOwnProfile.mockStore';
import ExtendedProfile from './ExtendedProfile';

const mockStore = configureMockStore([thunk]);

configureI18n({
  loggingService: { logError: jest.fn() },
  config: {
    ENVIRONMENT: 'production',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  messages: i18nMessages,
});

const extendedProfileData = [
  { fieldName: 'job_title', fieldValue: 'Researcher' },
  { fieldName: 'profession', fieldValue: 'Academia' },
];

const makeStore = (overrides = {}) => ({
  ...viewOwnProfileMockStore,
  profilePage: {
    ...viewOwnProfileMockStore.profilePage,
    ...overrides,
    account: {
      ...viewOwnProfileMockStore.profilePage.account,
      extendedProfile: extendedProfileData,
      ...(overrides.account || {}),
    },
  },
});

const defaultProps = {
  extendedProfile: extendedProfileData,
  visibility: {
    jobTitle: 'all_users',
    profession: 'all_users',
  },
  openHandler: jest.fn(),
  closeHandler: jest.fn(),
  submitHandler: jest.fn(),
  changeHandler: jest.fn(),
};

const Wrapper = ({ store, ...props }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: { userId: null, username: null, administrator: false },
    config: getConfig(),
  }), []);
  return (
    <AppContext.Provider value={contextValue}>
      <IntlProvider locale="en">
        <Provider store={store}>
          <ExtendedProfile {...props} />
        </Provider>
      </IntlProvider>
    </AppContext.Provider>
  );
};

Wrapper.defaultProps = {
  store: mockStore(makeStore()),
};

Wrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('<ExtendedProfile />', () => {
  it('renders nothing when extendedProfile is empty', () => {
    const emptyStore = makeStore({ account: { extendedProfile: [] } });
    const { container } = render(
      <Wrapper {...defaultProps} extendedProfile={[]} store={mockStore(emptyStore)} />,
    );
    expect(container.querySelector('.mb-5')).toBeNull();
  });

  it('renders job title field when job_title is present', () => {
    render(<Wrapper {...defaultProps} store={mockStore(makeStore())} />);
    expect(screen.getByText('Job Title')).toBeTruthy();
  });

  it('renders profession field when profession is present', () => {
    render(<Wrapper {...defaultProps} store={mockStore(makeStore())} />);
    expect(screen.getByText('Profession')).toBeTruthy();
  });

  it('renders only job title when only job_title is in extendedProfile', () => {
    const jobOnlyData = [{ fieldName: 'job_title', fieldValue: 'Researcher' }];
    const store = makeStore({ account: { extendedProfile: jobOnlyData } });
    render(
      <Wrapper
        {...defaultProps}
        extendedProfile={jobOnlyData}
        store={mockStore(store)}
      />,
    );
    expect(screen.getByText('Job Title')).toBeTruthy();
    expect(screen.queryByText('Profession')).toBeNull();
  });

  it('displays translated value for job title in editable mode', () => {
    render(<Wrapper {...defaultProps} store={mockStore(makeStore())} />);
    expect(screen.getByText('Researcher')).toBeTruthy();
  });

  it('displays translated value for profession in editable mode', () => {
    render(<Wrapper {...defaultProps} store={mockStore(makeStore())} />);
    expect(screen.getByText('Academia')).toBeTruthy();
  });

  describe('editing mode', () => {
    it('renders a select with English display string option values matching the backend', () => {
      const store = makeStore({ currentlyEditingField: 'job_title' });
      const { container } = render(
        <Wrapper {...defaultProps} store={mockStore(store)} />,
      );
      const select = container.querySelector('select#job_title');
      expect(select).toBeTruthy();
      const options = select.querySelectorAll('option');
      // First option is the blank placeholder
      expect(options[0].value).toBe('');
      // Option values are English display strings (matching backend storage)
      expect(options[1].value).toBe('Clinician');
      expect(options[1].textContent).toBe('Clinician');
    });

    it('renders a blank placeholder option', () => {
      const store = makeStore({ currentlyEditingField: 'job_title' });
      const { container } = render(
        <Wrapper {...defaultProps} store={mockStore(store)} />,
      );
      const select = container.querySelector('select#job_title');
      const firstOption = select.querySelector('option');
      expect(firstOption.value).toBe('');
    });

    it('calls changeHandler with updated extendedProfile on selection change', () => {
      const changeHandler = jest.fn();
      const store = makeStore({ currentlyEditingField: 'job_title' });
      const { container } = render(
        <Wrapper
          {...defaultProps}
          changeHandler={changeHandler}
          store={mockStore(store)}
        />,
      );
      const select = container.querySelector('select#job_title');
      fireEvent.change(select, { target: { name: 'job_title', value: 'Clinician' } });
      expect(changeHandler).toHaveBeenCalledWith('extendedProfile', [
        { fieldName: 'job_title', fieldValue: 'Clinician' },
        { fieldName: 'profession', fieldValue: 'Academia' },
      ]);
    });

    it('handles change for a field not yet in extendedProfile', () => {
      const changeHandler = jest.fn();
      const jobOnlyData = [{ fieldName: 'job_title', fieldValue: '' }];
      const store = makeStore({
        currentlyEditingField: 'job_title',
        account: { extendedProfile: jobOnlyData },
      });
      const { container } = render(
        <Wrapper
          {...defaultProps}
          extendedProfile={jobOnlyData}
          changeHandler={changeHandler}
          store={mockStore(store)}
        />,
      );
      const select = container.querySelector('select#job_title');
      fireEvent.change(select, { target: { name: 'job_title', value: 'Fellow' } });
      expect(changeHandler).toHaveBeenCalledWith('extendedProfile', [
        { fieldName: 'job_title', fieldValue: 'Fellow' },
      ]);
    });
  });
});

import Dashboard from 'components/dashboard/Dashboard';
import LaunchScreen from 'components/launch/LaunchScreen';
import PrivacyPolicy from 'components/privacy/PrivacyPolicy';
import { Login, Register, ResetPassword, ForgotPassword } from 'components/account';
import VerifyEmail from 'components/email/VerifyEmail';
import UnwatchedClass from 'components/email/UnwatchedClass';
import Settings from 'components/settings/SettingsContainer';
import Majors from 'components/majors/MajorsContainer';
import MyCourseView from 'components/mycourse/CourseBoardContainer';
import MyScheduleView from 'components/schedule/MyScheduleContainer';
import BrowseCourseView from 'components/browse/BrowseCourseContainer';
import CourseView from 'components/courselist/CourseViewContainer';
import ProfView from 'components/reviews/prof/ProfViewContainer';

export default [
  {
    path: '/',
    component: Dashboard,
    exact: true,
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy,
    exact: true,
  },
  {
    path: '/welcome',
    component: LaunchScreen,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/verify-email',
    component: VerifyEmail,
  },
  {
    path: '/unwatch-class',
    component: UnwatchedClass,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/majors/:faculty?/:majorKey?',
    component: Majors,
  },
  {
    path: '/my-courses',
    component: MyCourseView,
  },
  {
    path: '/my-schedule/:term?',
    component: MyScheduleView,
  },
  {
    path: '/schedule/:username/:term?',
    component: MyScheduleView,
  },
  {
    path: '/courses/browse',
    component: BrowseCourseView,
  },
  {
    path: '/courses/:subject/:catalogNumber',
    component: CourseView,
  },
  {
    path: '/professors/:profName',
    component: ProfView,
  },
];

// import { useState, useEffect } from 'react';
// import { getSession } from 'next-auth/client';
import { changeUserPasswordAPI } from '../../api';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
  // functionality implemented on the /profile page with getServerSideProps
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  async function changePasswordHandler(passwordData) {
    try {
      const result = await changeUserPasswordAPI(passwordData);
      console.log('%c-> developmentConsole: result===> ', 'color:#77dcfd', result);
    } catch (error) {
      console.log('%c-> developmentConsole: error===> ', 'color:#77dcfd', error);
    }
  }
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;

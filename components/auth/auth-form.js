import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';

import { createUserAPI } from '../../api';

import classes from './auth-form.module.css';

function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {
      // log user in
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      console.log('%c-> developmentConsole: result= ', 'color:#77dcfd', result);

      if (!result.error) {
        router.replace('/profile');
      }
    } else {
      try {
        // register use
        await createUserAPI(enteredEmail, enteredPassword);
      } catch (error) {
        console.log('%c-> developmentConsole: error= ', 'color:#77dcfd', error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passwordInputRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;

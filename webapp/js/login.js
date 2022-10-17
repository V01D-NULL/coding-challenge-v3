"use strict";

const { useState } = React;

const FormComponent = ({ event, Id, route, description }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form
          onSubmit={(e) => event(e, username, password, route)}
          action={route}
          id={`${Id}-form`}
          method="POST"
        >
          <input
            type="username"
            required
            name="username"
            placeholder="Username"
            onChange={onChangeUsername}
          />
          <input
            minLength="6"
            type="password"
            required
            name="password"
            placeholder="Password"
            onChange={onChangePassword}
          />
          <input type="submit" value={description} id={Id} />
        </form>
      </div>
    </>
  );
};

const LoginApp = () => {
  const onSubmitOverride = (e, username, password, route) => {
    e.preventDefault();
    apiSubmitCredentials([username, password], route, () => {
      if (route === "/login") window.location.href = "index.html";
      else alert("Successfully created account");
    });
  };
  return (
    <>
      <h1>Sign up</h1>
      <br />
      <FormComponent
        event={onSubmitOverride}
        Id="signup"
        route="/signup"
        description="Sign up"
      />

      <h1>Log in</h1>
      <br />
      <FormComponent
        event={onSubmitOverride}
        Id="login"
        route="/login"
        description="Log in"
      />
    </>
  );
};

ReactDOM.render(<LoginApp />, document.getElementById("login-root"));

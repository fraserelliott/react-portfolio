const LoginForm = () => {
  return (
  <main className="panel w-m text-align-center">
    <form className="flex flex-column">
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" />
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </main>
  );
};

export default LoginForm;

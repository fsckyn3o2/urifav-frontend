
const SignInFactory = {
    createSignIn: (username = undefined, password = undefined) => ({
        "username": username,
        "password": password
    }),
    emptySignIn: () => SignInFactory.createSignIn(),
    cloneSignIn: (signIn) => SignInFactory.createSignIn(signIn.username, signIn.password)
}

export default SignInFactory;

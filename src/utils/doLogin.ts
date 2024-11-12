async function doLogin(email: string, password: string, navigate: any): Promise<boolean> {
    const requestObject: object = { email: email, password: password };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/login",
        {
            method: "POST",
            body: request,
            headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // User exists but is not verified
      if (
        responseObject["error"] ===
        "Please verify your email before logging in."
      ) {
        // Prompt them to verify
        navigate("/verify", { state: { email: email, password: password } });
        return true;
      }
      // User doesn't exist
      else if (responseObject["id"] <= 0) {
        return false;
        // User exists
      } else {
        // Save the user's info to local storage
        const user: object = {
          id: responseObject["id"],
          firstName: responseObject["firstName"],
          lastName: responseObject["lastName"],
          email: email,
        };
        localStorage.setItem("user_data", JSON.stringify(user));

        // Redirect to dashboard
        navigate("/dashboard");
        return true;
      }
    } catch (error) {
      alert(error);
      return false;
    }
}

export default doLogin;
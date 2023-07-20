// Interceptor para qualquer chamada feita através do axios para validar o token
import axios from "axios";

  axios.interceptors.request.use((config) => {
    const jwtToken = JSON.parse(localStorage.getItem('token'))
    if (jwtToken == null) {
      return config;
    }
    config.headers.common["Authorization"] = `bearer ${jwtToken.token}`;
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        const jwtToken = JSON.parse(localStorage.getItem('token'))
        const refreshToken = jwtToken.refresh_token
        const payload = {
            grant_type: 'refresh_token',
            client_id: '',
            client_secret: '',
            email: '',
            username: '',
            password: '',
            refresh_token: refreshToken
        };
       

        // var response = await axios.post(
        //   "https://portaldepedidos.liz.com.br/api/token/auth",
        //   payload 
        // );

        var response = await axios.post(
          "http://localhost:56895/api/token/auth",
          payload 
        );
        localStorage.setItem('token', JSON.stringify(response.data.payload))   
        error.config.headers[ "Authorization"] = `bearer ${response.data.payload.token}`;
        return axios(error.config);
      } else {
        //this.$router.push({ path:"/login" })
        return Promise.reject(error);
      }
    }
  );

  export default axios
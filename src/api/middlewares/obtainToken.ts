import OAuth2Server from "oauth2-server";
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
import oAuth from "../auth/oauth2.server";

function obtainToken(req:any, res:any) {

	let request = new Request(req);
	let response = new Response(res);

	return oAuth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

export default obtainToken
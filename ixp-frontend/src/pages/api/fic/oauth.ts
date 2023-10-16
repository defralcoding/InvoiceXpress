import { NextApiRequest, NextApiResponse } from "next";
import {
	OAuth2AuthorizationCodeManager,
	Scope,
} from "@fattureincloud/fattureincloud-ts-sdk";
import fs from "fs";

export default async function getOAuthAccessToken(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let query = req.query;
	let params = new URLSearchParams(query as any);

	let oauth = new OAuth2AuthorizationCodeManager(
		process.env.FIC_CLIENT_ID,
		process.env.FIC_CLIENT_SECRET,
		"http://localhost:3000/api/fic/oauth"
	);

	if (!params.get("code")) {
		return res.redirect(
			oauth.getAuthorizationUrl(
				[
					Scope.ENTITY_SUPPLIERS_READ,
					Scope.ISSUED_DOCUMENTS_INVOICES_ALL,
				],
				"EXAMPLE_STATE"
			)
		);
	} else {
		let code = params.get("code");

		try {
			let token = await oauth.fetchToken(code ?? "");
			// saving the oAuth access token in the token.json file
			console.log("token", token);
			res.redirect("/oauth/fic/success");
		} catch (e) {
			res.status(500).send("An error occurred.");
			console.log(e);
		}
	}
}

import {NextApiRequest, NextApiResponse} from "next";


export default (req: NextApiRequest, res: NextApiResponse) => {
    res.redirect(`http://localhost:8080/realms/code_snippets/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent("http://localhost:3000/")}`);
};
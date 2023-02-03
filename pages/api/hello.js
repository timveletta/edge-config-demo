// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAll } from '@vercel/edge-config';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { greeting } = await getAll(['greeting']);
		res.status(200).json({ greeting });
	} else if (req.method === 'POST') {
		const greeting = req.body.greeting;
		const result = await fetch(
			'https://api.vercel.com/v1/edge-config/ecfg_ntchbrxqkjbwhtorydhhkmoxkxto/items',
			{
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					items: [
						{
							operation: 'update',
							key: 'greeting',
							value: greeting,
						},
					],
				}),
			}
		);
		const json = await result.json();
		if (json.status !== 'ok') {
			console.error('Failed to update edge config', json);
		}
		res.status(200).json({ greeting });
	}
}

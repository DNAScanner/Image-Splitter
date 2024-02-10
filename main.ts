import {createCanvas, loadImage} from "https://deno.land/x/canvas@v1.4.1/mod.ts";

interface Image {
	name: string;
	data: string;
}

const split = Number(Deno.readTextFileSync("split")) || 0;
const prefix = Deno.readTextFileSync("prefix") || "";

const image = await loadImage(Deno.readFileSync("input.png"));
const canvas = createCanvas(Math.floor(image.width() / split), Math.floor(image.width() / split));
const ctx = canvas.getContext("2d");

let bioString = "";
const images: Image[] = [];

let counter = 0;
for (let row = 0; row < split; row++) {
	for (let column = 0; column < split; column++) {
		const placeImageCoords = {
			x: 0 - column * (image.width() / split),
			y: 0 - row * (image.width() / split),
		};

		ctx.clearRect(0, 0, Math.floor(image.width() / split), Math.floor(image.width() / split));
		ctx.drawImage(image, placeImageCoords.x, placeImageCoords.y);

		if (images.find((savedImage) => savedImage.data === canvas.toDataURL())) bioString += `:${images.find((savedImage) => savedImage.data === canvas.toDataURL())?.name}:`;
		else {
			images.push({
				name: prefix + ("0000" + String(counter)).slice(-2),
				data: canvas.toDataURL(),
			});

			Deno.mkdirSync("output", {recursive: true});

			Deno.writeFileSync(`output/${prefix + ("0000" + String(counter)).slice(-2)}.png`, canvas.toBuffer(), {create: true});
			bioString += `:${prefix + ("0000" + String(counter)).slice(-2)}:`;
		}
		counter++;
		if (counter % split === 0) bioString += "\n";
	}
}

Deno.writeTextFileSync("bio.txt", bioString);

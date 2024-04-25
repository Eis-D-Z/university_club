# Setting up

This project is a demo. You are welcome to shape it into production code.

The main contract is in the main directory and in a production scenario it should be published only once.


Every club must create a unique identifier on chain to use the contract. The code is simple and can be found under `club_name/`.
Please edit `club_name/unique_name.move` and change the struct name to your club's name.


# Publishing

Publishing scripts that will save the generated id's can be found in `app/publish/`.

First run the `publish.ts` with `tsx publish.ts` or `ts-node publish.ts` to publish the main contract in a test environment.
This script has a guard against publishing on mainnet. This should be removed if you have production code.

Second run the `publish_unique_name.ts` after you edited the contract with your club's name.

# Using
Now you can create your club by runing the project with `pnpm dev` and going to `localhost:5173/new`.
Connect your wallet, edit the name of the club (eg: add spaces instead of underscores), but please keep the names similar otherwise it will fail.
Press the button to execute the transaction and the id of the `Club` object will appear.

Copy the id that appears and edit `app/constants.ts` by adding `export const clubId = "<copied-id>;"` at the end.

Now you are ready to go to `localhost:5173` the president of the Club (the owner of the address that created it) can add a new meeting.
Also at `localhost:5173/new_member` you can add new members as long as you have their wallet address.

When a meeting was added a QR code will apear for everyone to scan. This will redirect their devices to `localhost:3000/check-in` where they will need to connect their wallet and press the `check-in` button which will start a transaction that will record the user's attendance.

# Missing parts
The app has many pages that should be separated. The president only functions like club creation, adding members and setting meetings should be separate from the check-in page. These should be two different apps but they were merged here into one.

Strict checks are missing in different parts of the flows. Eg. right now an user can check-in twice, these were on purpose left un-checked, but a ready project should have them in place.

The contract has basic code for adding accessories to your NFT. The Accessories contract should be implemented though, now it accepts any kind of Object and then proper images should be created for each combination of "basic emblem image" + "accessory". This can also be done dynamically if you want please refer to the SuiFrens code to see an example.

Typechecks for typescript are not strict (lots of any). This is bad practice and should be fixed.

Please use this code as a guide to create an actual project.
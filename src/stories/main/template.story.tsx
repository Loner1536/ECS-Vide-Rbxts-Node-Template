// // Package
// import { CreateReactStory, type InferProps } from "@rbxts/ui-labs";
// import ReactRoblox from "@rbxts/react-roblox";
// import React from "@rbxts/react";

// // Dependencies
// import Setup from "../setup";

// const controls = {
//     visible: true,
// };

// const story = CreateReactStory(
//     {
//         reactRoblox: ReactRoblox,
//         react: React,
//         controls,
//     },
//     (storyProps: InferProps<typeof controls>) => (
//         <Setup
//             storyProps={storyProps}
//             callback={(_, forge) => {
//                 forge.set("Template", storyProps.controls.visible);
//             }}
//         />
//     ),
// );

// export = story;

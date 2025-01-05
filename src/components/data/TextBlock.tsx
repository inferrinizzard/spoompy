import Block from "../Block";

export interface TextBlockProps {
	text: string;
	caption: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({ text, caption }) => {
	return (
		<Block width={2}>
			<h1>{text}</h1>
			<h3>{caption}</h3>
		</Block>
	);
};

export default TextBlock;

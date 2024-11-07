import { useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import OpenAI from "openai";


const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const [imageUrl, setImageUrl] = useState("");
	const [paraData, setParaData] = useState("");
	const [modalOpen, setIsModalOpen] = useState(false);
	const [modalOpen1, setIsModalOpen1] = useState(false);
	const inputRef = useRef('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	const imageGeneration = async () => {
		const response = await fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer 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",
				"User-Agent": "Chrome"
			},
			body: JSON.stringify({
				prompt: `${inputRef.current.value}`,
				n: 1,
				size: "512x512"
			})
		});
		const data = await response.json();
		setImageUrl(data.data[0].url);
		setIsModalOpen(true);
	};

	const generateText = async () => {
		const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true })
		const aiModel = "gpt-3.5-turbo-1106"

		const messages = [
			{
				role: "system",
				content: "you are a assistant"
			},
			{
				role: "user",
				content: inputRef.current.value
			},
			{
				role: "system",
				content: "end of conversation"
			}
		];

		try {
			const completion = await openai.chat.completions.create({
				model: aiModel,
				messages: messages
			});

			const aiResponse = completion.choices[0].message.content;
			setParaData(aiResponse);
			setIsModalOpen1(true);
		} catch (error) {
			console.error("Error generating text:", error);
		}
	}

	const closeModal = () => {
		setIsModalOpen(false);
	};
	const closeModal1 = () => {
		setIsModalOpen1(false);
	};


	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					ref={inputRef}
				/>
				<div className="d-flex">
					<p className='absolute inset-y-0 end-0 flex items-center pe-3' onClick={() => { generateText() }}>
						<i class="fa-solid fa-pen" style={{ paddingRight: "4rem" }}></i>
					</p>
					{modalOpen1 ? (
						<div className="image-popup" >
							<i class="fa-solid fa-xmark cancel-btn" onClick={() => (closeModal1())} ></i>
							<p>{paraData}</p>
						</div>
					) : ""
					}
					{modalOpen ? (
						<div className="image-popup" >
							<i class="fa-solid fa-xmark cancel-btn" onClick={() => (closeModal())} ></i>
							<img src={imageUrl} alt="Generated Image" />
						</div>
					) : ""
					}
					<p className='absolute inset-y-0 end-0 flex items-center pe-3' onClick={() => { imageGeneration() }}>
						<i class="fa-solid fa-image" style={{ paddingRight: "2rem" }}></i>
					</p>
					<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>
			</div>
		</form>
	);
};
export default MessageInput;


import "./index.less";
import request from "@/api";
import { Button, message, Upload } from "antd";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import SparkMD5 from "spark-md5";
const UseComponent = () => {
	const [fileList, setFileList] = useState<UploadFile<"audio/mpeg">[]>([]);
	const [uploading, setUploading] = useState(false);

	const handleUpload = () => {
		console.log(fileList, "fileList");
		const file = fileList[0] as RcFile;

		const sliceBuffer: Blob[] = [];
		let sliceSize = file.size;
		if (!sliceSize || sliceSize <= 0) return;
		while (sliceSize > 1024 * 1024) {
			const blobPart: Blob = file.slice(sliceBuffer.length * 1024 * 1024, (sliceBuffer.length + 1) * 1024 * 1024);
			sliceBuffer.push(blobPart);
			sliceSize -= 1024 * 1024;
		}

		if (sliceSize > 0) {
			sliceBuffer.push(file.slice(sliceBuffer.length * 1024 * 1024, file.size));
		}

		console.log(sliceBuffer, "sliceBuffer");
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);

		fileReader.onload = async result => {
			if (!result.target || !result.target.result) return;

			//get the final file hash
			const fileHash = SparkMD5.ArrayBuffer.hash(result.target.result as ArrayBuffer);

			const { state, message: checkMsg } = await checkChunk(fileHash);
			console.log(state, "state");
			console.log(checkMsg, "checkMsg");
			if (state === 1) return message.success("upload successfully.");

			let chunkRequests: Promise<{
				chunkList: string[];
			}>[] = [];

			sliceBuffer.forEach((blob, index) => {
				if (!checkMsg.includes(index.toString())) {
					chunkRequests.push(uploadChunk(fileHash, new File([blob], `${index}`)));
				}
			});
			if (!chunkRequests.length) {
				return mergeChunk(fileHash, file.name);
			} else {
				const res = await Promise.all(chunkRequests);
				console.log(res, "resresresres");
				return mergeChunk(fileHash, file.name);
			}
		};

		return;
		const formData = new FormData();
		fileList.forEach(file => {
			formData.append("files", file as RcFile);
		});
		setUploading(true);
		// You can use any AJAX library you like
		fetch("https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(() => {
				setFileList([]);
				message.success("upload successfully1.");
			})
			.catch(() => {
				message.error("upload failed.");
			})
			.finally(() => {
				setUploading(false);
			});
	};

	function checkChunk(hash: string) {
		return request.get<{ state: number; message: string[] }>("/api/upload/checkChunk", { hash });
	}
	function mergeChunk(hash: string, fileName: string) {
		console.log(fileName, "fileName");
		return request.get<{ state: number; message: string[] }>("/api/upload/mergeChunk", { hash, fileName });
	}
	function uploadChunk(hash: string, file: Blob) {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("hash", hash);
		return request.post<{ chunkList: string[] }>("/api/upload/uploadChunk", formData, {
			headers: {
				noCancel: "true"
			}
		});
	}

	const props: UploadProps = {
		onRemove: file => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList);
		},
		beforeUpload: file => {
			setFileList([...fileList, file]);

			return false;
		},
		fileList
	};
	return (
		<div className="card content-box">
			<span className="text">UseComponent 🍓🍇🍈🍉</span>
			<div>
				<Button
					onClick={async () => {
						const res = await request.get("/api/upload/checkChunk", { hash: "123" });
						console.log(res, "checkChunk");
					}}
				>
					checkFile
				</Button>
				<Button
					onClick={async () => {
						const fileForm = new FormData();
						fileForm.append("hash", "abc");
						const res = await request.post("/api/upload/uploadChunk", fileForm);
						console.log(res, "checkChunk");
					}}
				>
					uploadFile
				</Button>
				<Upload {...props}>
					<Button icon={<UploadOutlined />}>Select File</Button>
				</Upload>
				<Button
					type="primary"
					onClick={handleUpload}
					disabled={fileList.length === 0}
					loading={uploading}
					style={{ marginTop: 16 }}
				>
					{uploading ? "Uploading" : "Start Upload"}
				</Button>
			</div>
		</div>
	);
};

export default UseComponent;

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Bar } from "./";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleTransfer, processTransferRequest } from "../redux/actions/index";

const TransferAccept = () => {
	// const { user } = useSelector((state) => state.user);
	const { transfer } = useSelector((state) => state.transfer);
	const [data, setData] = useState({});
	const params = useParams();
	const dispatch = useDispatch();
	const [qrUrl, setQrUrl] = useState("");

	const processRequest = (action) => {
		const process = { transferId: data.transferId, action, amount: data.amount };
		dispatch(processTransferRequest(process));
	};

	useEffect(() => {
		dispatch(getSingleTransfer(params.id));
	}, []);

	useEffect(() => {
		const getQrCode = async (url) => {
			if (transfer) {
				try {
					const response = await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`);
					setQrUrl(response.request.responseURL);
				} catch (error) {
					console.error("Error fetching QR code:", error);
				}
			}
		};

		if (transfer) {
			const { transferdata, bank } = transfer;
			const data = {
				name: transferdata.user.firstName + " " + transferdata.user.lastName,
				amount: transferdata.amount,
				date: new Date(transferdata.createdAt).toLocaleDateString(),
				status: transferdata.status,
				accountNumber: bank.accountNumber,
				accountHolderName: bank.accountHolderName,
				accountType: bank.accountType,
				bankName: bank.bankName,
				ifscCode: bank.ifscCode,
				upi: transferdata.upi,
				phone: transferdata.user.contact,
				email: transferdata.user.email,
				transferId: transferdata._id,
			};
			setData(data);
			getQrCode(data.upi);
		}
	}, [transfer]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="transferAccept">
				<Bar />
				<h2>Transfer Request</h2>
				<div className="flexDiv">
					<div className="query">
						<h3>Any Query Call</h3>
						<h5>+91 {data.phone}</h5>
						<h6>Email @</h6>
						<p>{data.email}</p>
					</div>
					<div className="paymentDetails">
						<div className="left">{qrUrl && <img src={qrUrl} alt="QR Code" />}</div>
						<div className="right">
							<h3>Payment Details</h3>
							<h5>Name: {data.name}</h5>
							<h5>Amount: {data.amount}</h5>
							<h5>Date: {data.date}</h5>
							<h5>Account Number: {data.accountNumber}</h5>
							<h5>Account Holder Name: {data.accountHolderName}</h5>
							<h5>Account Type: {data.accountType}</h5>
							<h5>Bank Name: {data.bankName}</h5>
							<h5>IFSC Code: {data.ifscCode}</h5>
							<h5 className={data.status === "pending" ? "purple" : data.status === "accepted" ? "green" : "red"}>
								Status: {data.status}
							</h5>
						</div>
						{data.status === "pending" && (
							<div className="buttonsConf">
								<button onClick={() => processRequest(true)}>Accept</button>
								<button onClick={() => processRequest(false)}>Reject</button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default TransferAccept;

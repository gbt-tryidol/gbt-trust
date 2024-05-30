
import { AdminSidebar, Bar } from "../components";
import Select, { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { LineChart } from "../components/Chart";
import { Table, TableBody, TableContainer, TableHeaders, TableHeading, RequestRow } from "../components/TableHOC";

const customerHeaders = ["Order ID", "Details", "Amount", "Date", "Invoice"];

const accountTypeOptions = [
	{ value: "sbi", label: "State Bank Of India" },
	{ value: "cbi", label: "Central Bank of India" },
	{ value: "icici", label: "ICICI Bank" },
];

const customerData = [
	{
		data: ["ID-00300", "Purchase at XYZ Mart", "₹ 20,000.00", "May 24, 2020"],
		status: "download",
		_id: 1,
	},
	{
		data: ["ID-00295", "Withdrawal - ATM ABC123", "₹ 80,000.00", "October 30, 2017"],
		status: "download",
		_id: 2,
	},
	{
		data: ["ID-00298", "Stock Purchase - ABC Company", "₹ 12,000.00", "February 9, 2015"],
		status: "download",
		_id: 3,
	},
	{
		data: ["ID-00291", "Services Rendered", "₹ 89,900.00", "December 29, 2012"],
		status: "download",
		_id: 4,
	},
	{
		data: ["ID-00290", "Purchase at XYZ Mart", "₹ 20,000.00", "May 24, 2020"],
		status: "download",
		_id: 1,
	},
];

const analyticsFilterOptions = [
	{ value: "2020", label: "2020" },
	{ value: "2021", label: "2021" },
	{ value: "2022", label: "2022" },
	{ value: "2023", label: "2023" },
	{ value: "2024", label: "2024" },
];
const customStyles = {
	control: (provided) => ({
		...provided,
		cursor: "pointer",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		outline: "none",
		justifyContent: "flex-end",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			outline: "none",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.2rem",
		borderRadius: "10px",
		fontSize: "1.1rem",
		opacity: "0.8",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			color: "#ac3e2e",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		fontSize: "2rem",
		"&:hover, &:focus": {
			color: "#ac3e2e",
		},
	}),
};

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

const dummyData = [54, 566, 75, 145, 455, 65, 455, 120, 319, 100, 200, 600];

const Statements = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		// const total = dummyData.reduce((acc, curr) => acc + curr, 0);
		const percentageData = dummyData.map((value) => ((value / 6) * 1).toFixed(2));
		setData(percentageData);
	}, []);

	const [isAdmin, setIsAdmin] = useState("admin");

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="dashboard">
				<Bar heading="Statements" />
				<section className="statements">
					{isAdmin === "admin" ? (
						/*<div className="statement-chart">
							<div className="heading">
								<h2>Worth Analysis</h2>
								<Select
									options={analyticsFilterOptions}
									styles={customStyles}
									components={{ DropdownIndicator }}
									placeholder="Filter"
								/>
							</div>
							<div className="chart">
								<LineChart
									backgroundColor="transparent"
									borderColor="#003D79"
									data={data}
									labels={["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"]}
								/>
							</div>
							<div className="points">
								<div className="info">
									<div className="circ"></div>
									<span>Analysis</span>
								</div>
								<h1>
									₹ <span>Transactions:</span> 213929.00
								</h1>
							</div>
					</div>*/
					null
					) : (
						<>
							<section className="generate-statement-container">
								<div className="generate-statement">
									<h1 className="heading">Generate Statement</h1>
									<form>
										<div style={{ width: "80%" }}>
											<Select
												styles={customStyles}
												components={{ DropdownIndicator }}
												options={accountTypeOptions}
												placeholder="Select Bank"
											/>
										</div>

										<div>
											<label htmlFor="Member ID"></label>
											<input type="text" id="memberid" placeholder="Details" />
										</div>
										<div>
											<label htmlFor="How many Pin"></label>
											<input type="text" id="pin" placeholder="Amount" />
										</div>
									</form>
									<div className="buttons">
										<button className="btn btn-primary">Generate Pin</button>
										<button style={{ backgroundColor: "#003D79", marginLeft: "1rem" }} className="btn btn-primary">
											Add New
										</button>
									</div>
								</div>

								{/* <div className="total-transaction">
									<h1>Total Transaction</h1>
									<LineChart
										backgroundColor="transparent"
										borderColor="#003D79"
										data={[12, 23, 23, 564, 342, 243, 3, 556, 34, 76, 32, 345]}
										labels={["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"]}
									/>
								</div> */}
							</section>
						</>
					)}

					<TableContainer className="statement-table">
						<TableHeading>
							<p>Statements</p>
							<Select options={analyticsFilterOptions} styles={customStyles} components={{ DropdownIndicator }} placeholder="Filter" />
						</TableHeading>
						<Table>
							<TableHeaders
								style={{
									gridTemplateColumns: `repeat(${customerHeaders.length},1fr)`,
								}}
								headers={customerHeaders}
							/>
							<TableBody TableRow={RequestRow} data={customerData} />
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
	);
};

export default Statements;

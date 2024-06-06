import { AdminSidebar, Bar } from "../components";
import { useEffect, useState } from "react";
import { Table, TableBody, TableContainer, TableHeaders, TableHeading, StatementRow } from "../components/TableHOC";
import { useDispatch, useSelector } from "react-redux";
import { getAllStatements } from "../redux/actions/statement.action";
import Select, { components } from "react-select";
import { CUSTOME_STYLES } from "../assets/data/constants";
import { FaSort } from "react-icons/fa";

const customerHeaders = ["S no", "Details", "Amount", "Transaction", "Date"];

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

function formatDate(date) {
	// Ensure date is in the correct format
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	// Array of month names
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Get components of the date
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	// Format the date
	const formattedDate = `${day}, ${months[month]}, ${year}`;

	return formattedDate;
}

const Statements = () => {
	const [adminData, setAdminData] = useState([]);
	const [debitedStatement, setDebitedStatement] = useState([]);
	const [month, setMonth] = useState("");
	const [monthOptions, setMonthOptions] = useState([]);
	const { user } = useSelector((state) => state.user);
	const { statements } = useSelector((state) => state.statement);
	const dispatch = useDispatch();

	useEffect(() => {
		// const total = dummyData.reduce((acc, curr) => acc + curr, 0);
		if (statements && statements?.length > 0) {
			const filteredData = statements.filter((st) => st.type === "debited");
			const creditData = statements.map((st, idx) => {
				return {
					data: [statements.length - idx, st.details, st.amount, st.type, formatDate(st.createdAt)],
					_id: st._id,
				};
			});
			const debitedData = filteredData.map((st, idx) => {
				return {
					data: [filteredData.length - idx, st.details, st.amount, "credited", formatDate(st.createdAt)],
					_id: st._id,
				};
			});
			const dateSet = new Set(creditData.map((transfer) => formatDate(new Date(transfer.data[4]).toLocaleDateString())));

			const uniqueDateArray = Array.from(dateSet).map((date) => ({
				label: date,
				value: date,
			}));
			setMonthOptions(uniqueDateArray);
			setDebitedStatement(debitedData);
			setAdminData(creditData);
		}
	}, [statements]);

	useEffect(() => {
		dispatch(getAllStatements());
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="dashboard">
				<Bar heading="Statements" />
				<section className="statements">
					<TableContainer className="statement-table">
						<TableHeading>
							<p>Statements</p>
							<Select
								defaultValue={monthOptions[0]}
								options={monthOptions}
								components={{ DropdownIndicator }}
								styles={CUSTOME_STYLES}
								onChange={(e) => setMonth(e.value)}
							/>
						</TableHeading>
						<Table>
							<TableHeaders
								style={{
									gridTemplateColumns: `repeat(${customerHeaders.length},1fr)`,
								}}
								headers={customerHeaders}
							/>
							<TableBody
								TableRow={StatementRow}
								data={
									user && user.role === "admin"
										? month
											? adminData.filter((i) => i.data[4] === month)
											: adminData.reverse()
										: month
										? debitedStatement.filter((i) => i.data[4] === month)
										: debitedStatement.reverse()
								}
							/>
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
	);
};

export default Statements;

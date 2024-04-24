/* eslint-disable react/prop-types */
import { AdminSidebar, Bar, TableBody, Table, TableContainer, TableHeaders, TableHeading, ProgramRow, Program2Row } from "../components";
import Select, { components } from "react-select";
import { CUSTOME_STYLES } from "../assets/data/constants";
import { IoIosArrowForward } from "react-icons/io";
import { FaChildren } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { registrationHeader, ownerSortOptions } from "../assets/data/owner";
import { FaSort } from "react-icons/fa";
import { useEffect, useState } from "react";
import { acceptEvent, getAllEvents } from "../redux/actions/";

//  ?--- dropdown indicator

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

const eventHeader = ["Event Name", "Requested By", "Request Date", "Program Date", "Budget", "Action"];
const passedEventHeader = ["Event Name", "Requested By", "Program Date", "Budget", "Action"];

function OurProgram() {
	const dispatch = useDispatch();
	const { events } = useSelector((state) => state.event);
	const { user } = useSelector((state) => state.user);

	const [usereventdata, setUserEventdata] = useState([]);
	const [eventdata, setEventdata] = useState([]);
	const [passedEventdata, setPassedEventdata] = useState([]);

	const acceptHandler = (id) => {
		dispatch(acceptEvent(id));
		dispatch(getAllEvents());
	};

	useEffect(() => {
		dispatch(getAllEvents());
	}, [dispatch]);

	useEffect(() => {
		if (events) {
			const currentDate = new Date();
			const upcomingEvents = [];
			const passedEvents = [];

			events.forEach((event) => {
				// Convert eventDate to a Date object
				const eventDate = new Date(event?.eventDate);

				const createdDate = new Date(event?.createdAt)?.toLocaleDateString();
				if (eventDate >= currentDate) {
					// Event is upcoming or today
					const readableDate = eventDate?.toLocaleDateString();
					upcomingEvents?.push({
						data: [
							event?.eventName,
							event?.eventManager?.firstName + " " + event?.eventManager?.lastName,
							createdDate,
							readableDate,
							event?.eventBudget,
						],
						status:
							user?.role === "admin" ? (
								<button
									className={
										event?.status === "approved"
											? "greenbg"
											: event.status === "completed"
											? "purplebg"
											: event.status === "ongoing"
											? "yellowbg"
											: "redbg"
									}
									style={{ borderRadius: "8px", color: "#fcfcfc" }}
									onClick={() => acceptHandler(event?._id)}
								>
									{event?.status}
								</button>
							) : (
								event?.status
							),
						_id: event._id,
					});
				} else {
					// Event date has passed
					const readableDate = eventDate.toLocaleDateString();
					passedEvents.push({
						data: [
							event?.eventName,
							event?.eventManager?.firstName + " " + event?.eventManager?.lastName,
							readableDate,
							event?.eventBudget,
						],
						status: event?.status,
						_id: event?._id,
					});
				}
			});

			const userEvent = upcomingEvents.filter((event) => event?.eventManager?._id === user?._id);

			setUserEventdata(setUserEventdata);
			// Update state with upcoming and passed events
			setEventdata(upcomingEvents);
			setPassedEventdata(passedEvents);
		}
	}, [events]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ourProgram">
				<Bar heading="Programs" />
				<section className="Programs">
					<div className="cardWidget">
						<CardWidget
							style={{ backgroundColor: "#003D79" }}
							heading="Upcoming"
							value={eventdata.length}
							Icon={FaChildren}
							Action={IoIosArrowForward}
						/>
						<CardWidget
							style={{ backgroundColor: "#003D79" }}
							heading="Program Done"
							value={passedEventdata.length}
							Icon={FaChildren}
							Action={IoIosArrowForward}
						/>
						<CardWidget style={{ backgroundColor: "#003D79" }} heading="Program Report" Icon={FaChildren} Action={IoIosArrowForward} />
					</div>

					{user?.role === "user" && (
						<>
							<TableContainer className="mini-table1">
								<TableHeading>
									<p>Program Request</p>
									{/* <input type="text" placeholder="Search..." />
									<Select
										defaultValue={ownerSortOptions[0]}
										options={ownerSortOptions}
										components={{ DropdownIndicator }}
										styles={CUSTOME_STYLES}
									/> */}
								</TableHeading>
								<Table>
									<TableHeaders
										style={{
											gridTemplateColumns: `repeat(${eventHeader.length},1fr)`,
										}}
										headers={eventHeader}
									/>
									<TableBody TableRow={ProgramRow} data={eventdata} />
								</Table>
							</TableContainer>

							<TableContainer className="mini-table1">
								<TableHeading>
									<p>Program History</p>
									{/* <input type="text" placeholder="Search..." />
									<Select
										defaultValue={ownerSortOptions[0]}
										options={ownerSortOptions}
										components={{ DropdownIndicator }}
										styles={CUSTOME_STYLES}
									/> */}
								</TableHeading>
								<Table>
									<TableHeaders
										style={{
											gridTemplateColumns: `repeat(${passedEventHeader.length},1fr)`,
										}}
										headers={passedEventHeader}
									/>
									<TableBody TableRow={ProgramRow} data={passedEventdata} />
								</Table>
							</TableContainer>
						</>
					)}

					{user?.role === "admin" && (
						<>
							<TableContainer className="mini-table1">
								<TableHeading>
									<p>Program Request</p>
									{/* <input type="text" placeholder="Search..." />
									<Select
										defaultValue={ownerSortOptions[0]}
										options={ownerSortOptions}
										components={{ DropdownIndicator }}
										styles={CUSTOME_STYLES}
									/> */}
								</TableHeading>
								<Table>
									<TableHeaders
										style={{
											gridTemplateColumns: `repeat(${eventHeader.length},1fr)`,
										}}
										headers={eventHeader}
									/>
									<TableBody TableRow={Program2Row} data={eventdata} />
								</Table>
							</TableContainer>

							{/* <TableContainer className="mini-table1">
								<TableHeading>
									<p>Program History</p>
									{/* <input type="text" placeholder="Search..." />
									<Select
										defaultValue={ownerSortOptions[0]}
										options={ownerSortOptions}
										components={{ DropdownIndicator }}
										styles={CUSTOME_STYLES}
									/> 
								</TableHeading>
								<Table>
									<TableHeaders
										style={{
											gridTemplateColumns: `repeat(${eventHeader.length},1fr)`,
										}}
										headers={eventHeader}
									/>
									<TableBody TableRow={ProgramRow} data={passedEventdata} />
								</Table>
							</TableContainer> */}
						</>
					)}
				</section>
			</main>
		</div>
	);
}

export default OurProgram;

export const CardWidget = ({ heading, Icon, Action, value, style }) => {
	return (
		<article className="pinCard" style={style}>
			<Icon />
			<div>
				<h3>{heading}</h3>
				{value && <p>{value}</p>}
			</div>
			<Action />
		</article>
	);
};

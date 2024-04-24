/* eslint-disable react/prop-types */
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userImage.png";
import { IoIosSettings, IoMdMail } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Bar({ heading }) {
	const { user } = useSelector((state) => state.user);

	return (
		<div className="bar">
			<h1>{heading}</h1>
			{/* <div>
				<BsSearch />
				<input onClick={handleSearchClick} value={query} onChange={handleSearch} type="text" placeholder="Search..." />
			</div> */}
			<article>
				{/* <i>
					<IoIosSettings />
				</i> */}
				<img src={user?.avatar} alt="user image" />
				<div>
					<h5>{user?.firstName + " " + user?.lastName}</h5>
					<p>{user?.role}</p>
				</div>
			</article>
		</div>
	);
}

export default Bar;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaSort } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { lazy, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { Box, Stack } from "@chakra-ui/layout";
import { Circle } from "@chakra-ui/react";
import { v4 } from "uuid";
import CardSO from "../components/CardSo";
import { useDispatch, useSelector } from "react-redux";
import { generateTree } from "../redux/actions/index";

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
		width: "fit-content",
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

const Tree = lazy(() => import("react-d3-tree"));

export function bfs(id, tree, node) {
	const queue = [];

	queue.unshift(tree);

	while (queue.length > 0) {
		const curNode = queue.pop();

		if (curNode.attributes?.id === id) {
			curNode.children.push(node);

			return { ...tree };
		}

		const len = curNode.children.length;

		for (let i = 0; i < len; i++) {
			queue.unshift(curNode.children[i]);
		}
	}
}

//  ?--- dropdown indicator

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

function TreeComponent() {
	const [treedata, setTreeData] = useState({
		name: "Root",
		attributes: {
			// id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f1",
			rank: "Owner",
		},
		children: [],
	});
	const dispatch = useDispatch();
	const { user, loading } = useSelector((state) => state.user);
	const { tree, loading: treeLoading } = useSelector((state) => state.tree);

	const [node, setNode] = useState();
	const close = () => setNode(undefined);

	const handleNodeClick = (datum) => {
		setNode(datum);
	};

	const handleSubmit = (familyMemberName) => {
		const newTree = bfs(node.attributes?.id, tree, {
			name: familyMemberName,
			attributes: {
				id: v4(),
			},
			children: [],
		});

		if (newTree) {
			setTree(newTree);
		}

		setNode(undefined);
	};

	const rectangleStyle = {
		fill: "#fff",
		strokeWidth: 2,
		backgroundColor: "#fff",
	};

	const renderRectangleSvgNode = (customProps, click) => {
		const { nodeDatum } = customProps;
		const width = 100;
		const height = 50;

		return (
			<g>
				<Circle
					style={rectStyle}
					circleStyle={{ backgroundColor: "pink" }}
					className="circ"
					fill="white"
					strokeWidth="2"
					r="50"
					onClick={() => click(nodeDatum)}
				/>
				<foreignObject width="200" height="200" x="-50" y="50">
					<div style="display: flex; flex-direction: column; align-items: center; border: 1px solid black; padding-bottom: 1rem; background-color: rgb(248, 248, 255);">
						<h3>CEO</h3>
						<ul style="list-style-type: none; padding: 0px;"></ul>
						<button style="text-align: center;">➡️ ⬅️ Collapse</button>
					</div>
				</foreignObject>

				<text fill="white" strokeWidth="2" x="30" y="-5">
					{nodeDatum.name}
				</text>
			</g>
		);
	};

	useEffect(() => {
		if (user) {
			dispatch(generateTree(user._id));
		}
	}, [dispatch, user]);

	useEffect(() => {
		if (tree) {
			setTreeData(tree);
		}
	}, [tree]);

	if (loading) {
		return <Loader />;
	}
	if (treeLoading) {
		return <Loader />;
	}

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="epin">
				<Bar heading="MyTree" />
				<section className="tree">
					<div className="tree__header">
						<h1>Tree Structure</h1>
						<Select options={analyticsFilterOptions} styles={customStyles} components={{ DropdownIndicator }} placeholder="Filter" />
					</div>
					<div className="tree__content">
						<Stack direction="column" spacing="md">
							<Box w="100%" h="100vh">
								{window.width > 1000 ? (
									<Tree
										data={
											treedata || {
												name: "Root",
												attributes: {
													// id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f1",
													rank: "Owner",
												},
												children: [],
											}
										}
										orientation={"vertical"}
										allowForeignObjects
										rootNodeClassName="node__root"
										branchNodeClassName="node__branch"
										leafNodeClassName="node__leaf"
										// eslint-disable-next-line no-unused-vars
										nodeLabelComponent={({ nodeDatum }) => <CardSO />}
										pathFunc="step"
										translate={{ x: "0", y: "250" }}
										pathClassFunc={() => "custom-link"}
										initialDepth={0}
										nodeSize={{
											x: 200,
											y: 200,
										}}
										separation={{
											siblings: 1,
											nonSiblings: 1,
										}}
									/>
								) : window.width > 600 && window.width < 1000 ? (
									<Tree
										data={
											treedata || {
												name: "Root",
												attributes: {
													// id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f1",
													rank: "Owner",
												},
												children: [],
											}
										}
										orientation={"vertical"}
										allowForeignObjects
										rootNodeClassName="node__root"
										branchNodeClassName="node__branch"
										leafNodeClassName="node__leaf"
										// eslint-disable-next-line no-unused-vars
										nodeLabelComponent={({ nodeDatum }) => <CardSO />}
										pathFunc="step"
										translate={{ x: "200", y: "150" }}
										pathClassFunc={() => "custom-link"}
										initialDepth={0}
										nodeSize={{
											x: 200,
											y: 200,
										}}
										separation={{
											siblings: 1,
											nonSiblings: 1,
										}}
									/>
								) : (
									<Tree
										data={
											treedata || {
												name: "Root",
												attributes: {
													// id: "411d9783-85ba-41e5-a6a3-5e1cca3d294f1",
													rank: "Owner",
												},
												children: [],
											}
										}
										orientation={"vertical"}
										allowForeignObjects
										rootNodeClassName="node__root"
										branchNodeClassName="node__branch"
										leafNodeClassName="node__leaf"
										// eslint-disable-next-line no-unused-vars
										nodeLabelComponent={({ nodeDatum }) => <CardSO />}
										pathFunc="step"
										translate={{ x: "200", y: "150" }}
										pathClassFunc={() => "custom-link"}
										initialDepth={0}
										nodeSize={{
											x: 200,
											y: 200,
										}}
										separation={{
											siblings: 1,
											nonSiblings: 1,
										}}
									/>
								)}
								{/* <NodeModal
                                    onSubmit={(familyMemberName) => handleSubmit(familyMemberName)}
                                    onClose={close}
                                    isOpen={Boolean(node)}
                                /> */}
							</Box>
						</Stack>
					</div>
				</section>
			</main>
		</div>
	);
}

export default TreeComponent;

export const CardWidget = ({ heading, Icon, Action, value }) => {
	return (
		<article className="pinCard">
			<Icon />
			<div>
				<h3>{heading}</h3>
				{value && <p>{value}</p>}
			</div>
			<Action />
		</article>
	);
};

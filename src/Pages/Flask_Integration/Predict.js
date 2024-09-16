import { useState, useEffect } from "react";

const Predict = () => {

	const [out,setout] = useState('hello');

	useEffect(() => {
		fetch("/api/ml").then(res => res.json()).then(data => { setout(data.name) });
	}, [])

	return <>
		<h1>Hello</h1>
		<p>Output : {out}</p>
	</>
};

export default Predict;
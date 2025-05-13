import { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const SignUp = () => {

	const [inputs, setInputs] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	})

	const {loading, signup} = useSignup()

	const handleSubmitForm =  (e) => {
		e.preventDefault();
		console.log(inputs);
		signup(inputs);
	}


	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up 
				</h1>

				<form onSubmit={handleSubmitForm} >
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input type='text' placeholder='Enter your full name' className='w-full input input-bordered  h-10' 
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
						/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Email</span>
						</label>
						<input type='email' placeholder='Enter your email' className='w-full input input-bordered h-10' 
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white'
					>
						Already have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700' 
							disabled={loading}
						>{loading ? 'Loading' : 'Sign Up'}</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;

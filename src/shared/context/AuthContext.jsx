import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient } from '../clients/supabaseClient'

const AuthContext = createContext(null)

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
	const [isFetching, setIsFetching] = useState(true)
	const [isError, setIsError] = useState(null)
	const [claims, setClaims] = useState(null)

	useEffect(() => {
		supabaseClient.auth.getClaims().then(({data: {claims}}) => {
			setClaims(claims)
		})

		const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
      supabaseClient.auth.getClaims().then(({ data: { claims } }) => {
        setClaims(claims)
      })
    })

		return () => subscription.unsubscribe()
	}, [])

	const logout = () => {
		supabaseClient.auth.signOut().then(() => {
			window.location.reload()
		})
	}

	const login = ({email, password}) => {
		supabaseClient.auth.signInWithPassword({
			email,
			password
		})
		.then((res) => {
			if(res.data){
				window.location.href = '/'
			}
		})
	}

	const register = ({ email, password, firstName, lastName }) => {
		supabaseClient.auth.signUp({
			email,
			password,
			options: {
			data: {
				firstName,
				lastName
			}
			}
		}).then(() => {
			document.location.href = '/'
		})
	}

	// supabaseClient.auth.signUp()

	return (
		<AuthContext value={{
			claims,
			isFetching,
			isError,
			logout,
			login,
			register
		}}>
			{children}
		</AuthContext>
	)
}

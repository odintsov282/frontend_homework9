import { NavLink } from 'react-router-dom'
import { Card } from '../components/post-card/post-card'
import s from './home-page.module.scss'
import { usePosts } from '../hooks/usePosts'
import { Paginator } from '../components/paginator'
import { useState } from 'react'
import { useAuthContext } from '../shared/context/AuthContext'

const MIN_PAGE = 0
const ITEMS_COUNT = 10

export const HomePage = () => {
	const [currentPage, setCurrentPage] = useState(MIN_PAGE)

	const {data, isFetched} = usePosts({
		limit: ITEMS_COUNT,
		offset: MIN_PAGE + currentPage * ITEMS_COUNT
	})

	const {claims, logout} = useAuthContext()

	return (
		<div className={s.page}>
			<div className={s.shell}>
				<header className={s.topbar}>
					<div className={s.brand}>
						<span className={s.brandMark}>∞</span>
						<span>enjooy</span>
					</div>

					<nav className={s.nav}>
						<NavLink className={`${s.navLink} ${s.navLinkActive}`} to="/">Home</NavLink>
						<NavLink className={s.navLink} to="/">Blog</NavLink>
						<NavLink className={s.navLink} to="/">Service</NavLink>
						<NavLink className={s.navLink} to="/">About</NavLink>
						<NavLink className={s.navLink} to="/">Contact</NavLink>
					</nav>

					{claims ? <>
						<button className={s.ghostButton} onClick={() => logout()}>Logout</button>
					</> :
						<div className={s.actions}>
						<NavLink className={s.ghostButton} to="./sign-in">Sign in</NavLink>
						<NavLink className={s.primaryButton} to="/sign-up">Register</NavLink>
					</div>}
				</header>
				<div className={s.content}>
					<main>
						<div className={s.sectionHeader}>
							<h2>Whiteboards are remarkable.</h2>
							<div className={s.line} />
						</div>

						<div className={s.grid}>
							{isFetched ? data?.data?.map((el) => (
								<Card key={el.id} post={el}/>
							)) : 'Loading...'}
						</div>

						<Paginator {...{
							currentPage, 
							setCurrentPage, 
							MIN_PAGE}}
							pageCount={data?.pages}/>
					</main>
				</div>
			</div>
		</div>
	)
}

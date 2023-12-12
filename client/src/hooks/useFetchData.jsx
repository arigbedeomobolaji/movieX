import { useEffect, useState } from "react";
import { GET_PAGINATED_MOVIES } from "../graphql/queries";
import { useQuery } from "@apollo/client";

export default function useFetchData({ observerTarget }) {
	const [pageNumber, setPageNumber] = useState(1);
	setPageNumber(pageNumber + 1);
	console.log(pageNumber);
	const { data, loading, error } = useQuery(GET_PAGINATED_MOVIES, {
		variables: {
			pageNumber: pageNumber,
			limit: 10,
			offset: 10,
		},
	});
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					(function () {})();
				}
			},
			{
				threshold: 1,
			}
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [observerTarget]);
	return { data, loading, error };
}

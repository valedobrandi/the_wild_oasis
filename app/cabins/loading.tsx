import Spinner from "../_components/Spinner";

export default function Loading() {
    return (
    <div className="grid items-center">
        <Spinner />
        <p className="text-xl text-primary-200 text-center">Loading cabins data...</p>
    </div>
);
}
import { Avatar, Box } from "@mui/material";

export default function Profile() {
    return (
        <div className="sm:flex py-8 mx-auto sm:items-center sm:mx-14">
            <Avatar className="w-1/2 h-full sm:w-1/4" src="https://mui.com/static/images/avatar/2.jpg" alt="Woman paying for a purchase"/>
            <div className="mt-4 sm:mt-0 sm:ml-10">
                <p className="mt-1 text-2xl leading-tight font-semibold text-gray-900">泡芙奏小白</p>
                <p className="text-sm font-thin py-1">
                    id: 123456
                </p>
                <p className="mt-1 text-base font-light line-clamp-2">泡芙生于2018, 卒于2022, 享年4岁, 泡芙生于2018, 卒于 2022, 享年4岁, 泡芙生于2018, 卒于2022, 享年4岁, 泡芙生于2018, 卒于2022, 享年4岁</p>
                <p className="text-blue-500 text-sm py-2">男</p>
                <div className="text-base font-thin flex">
                    <p>
                        <span className="font-medium pr-1">177</span>
                        <span>关注</span>
                    </p>
                    <p className="ml-5">
                        <span className="font-medium px-1">293</span>
                        <span>粉丝</span>
                    </p>
                    <p className="ml-5">
                        <span className="font-medium px-1">900+</span>
                        <span>获赞</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
import Sidebar from './Sidebar';

function Posts() {
    const posts = [
        {
            id: 681191,
            image: 'src/assets/img-4597_1746276984.jpg',
            label: 'Cho thuê phòng trọ',
            title: 'Cho thuê phòng cao cấp, đầy đủ tiện nghi, như căn hộ, ngay trung tâm Quận 10',
            price: '2.5 triệu / tháng',
            startDate: '2022-10-25 16:30:23',
            endDate: '29/03/2021 00:44:53',
            status: 'Tin hết hạn',
        },
        {
            id: 6,
            image: 'src/assets/img-4599_1746276981.jpg',
            label: 'Nhà cho thuê',
            title: 'Cho thuê số nhà 33 Triều Khúc',
            price: '2.5 triệu / tháng',
            startDate: '2022-08-20 18:53:36',
            endDate: '29/03/2021 00:44:53',
            status: 'Đang hoạt động ',
        },
        {
            id: 2,
            image: 'src/assets/img-4600_1746276972.jpg',
            label: 'Cho thuê phòng trọ',
            title: 'Cho thuê phòng trọ tại Tứ Hiệp',
            price: '2.5 triệu / tháng',
            startDate: '2022-08-20 18:33:20',
            endDate: '29/03/2021 00:44:53',
            status: 'Tin hết hạn',
        },
        {
            id: 2,
            image: 'src/assets/img-4600_1746276972.jpg',
            label: 'Căn hộ cao cấp',
            title: 'Cho thuê phòng trọ tại Tứ Hiệp',
            price: '2.5 triệu / tháng',
            startDate: '2022-08-20 18:33:20',
            endDate: '29/03/2021 00:44:53',
            status: 'Tin hết hạn',
        },
    ];

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />

            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Danh sách tin đăng</h1>

                <div className="border-b mb-6">
                    <button className="mr-4 border-blue-500 text-blue-500 font-semibold border-b-2 hover:text-blue-700 transition">
                        Tất cả ({posts.length})
                    </button>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="min-w-[900px] w-full table-auto border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-blue-100 text-gray-700 text-sm">
                            <tr>
                                <th className="p-3 border">Mã tin</th>
                                <th className="p-3 border">Ảnh</th>
                                <th className="p-3 border min-w-[250px]">Tiêu đề</th>
                                <th className="p-3 border">Giá</th>
                                <th className="p-3 border">Bắt đầu</th>
                                <th className="p-3 border">Kết thúc</th>
                                <th className="p-3 border">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={`${post.id}-${index}`} className="text-sm hover:bg-blue-50 transition">
                                    <td className="p-3 border text-center font-semibold text-gray-800">{post.id}</td>
                                    <td className="p-3 border">
                                        <img src={post.image} alt="Ảnh tin" className="w-50 h-30 object-cover rounded-lg shadow-md" />
                                    </td>
                                    <td className="p-3 border">
                                        <div className="flex flex-col">
                                            <span className={`text-white text-xs w-fit px-3 py-1 rounded-full mb-1 font-semibold ${post.label === 'Nhà cho thuê' ? 'bg-red-500' : post.label === 'Căn hộ cao cấp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                {post.label}
                                            </span>
                                            <a href="#" className="text-blue-600 hover:underline font-medium text-sm md:text-base">
                                                {post.title}
                                            </a>
                                            <div className="text-gray-500 mt-2 flex flex-wrap gap-3 text-sm">
                                                <span className="cursor-pointer hover:text-gray-800">🔁 Đăng lại</span>
                                                <span className="cursor-pointer hover:text-gray-800">👁️ Ẩn tin</span>
                                                <span className="cursor-pointer hover:text-gray-800">✏️ Sửa tin</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 border text-gray-800">{post.price}</td>
                                    <td className="p-3 border text-gray-600">{post.startDate}</td>
                                    <td className="p-3 border text-gray-600">{post.endDate}</td>
                                    <td className={`p-3 border text-center font-bold ${post.status.includes('hết hạn') ? 'text-red-500' : 'text-green-500'}`}>
                                        {post.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Posts;

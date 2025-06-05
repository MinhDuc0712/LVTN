import Sidebar from './Sidebar';
import { useState } from 'react';
import { Link } from 'react-router-dom';
function Posts() {
    const [posts, setPosts] = useState([
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
            status: 'Đang hoạt động',
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
            id: 3,
            image: 'src/assets/img-4600_1746276972.jpg',
            label: 'Căn hộ cao cấp',
            title: 'Cho thuê phòng trọ tại Tứ Hiệp',
            price: '2.5 triệu / tháng',
            startDate: '2022-08-20 18:33:20',
            endDate: '29/03/2021 00:44:53',
            status: 'Tin hết hạn',
        },
    ]);

    const [activeTab, setActiveTab] = useState('all');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleContinuePayment = (post) => {
        setSelectedPost(post);
        setShowPaymentModal(true);
    };

    const confirmPayment = () => {
        // Cập nhật trạng thái tin đăng sau khi thanh toán
        const updatedPosts = posts.map(p => 
            p.id === selectedPost.id ? {...p, status: 'Đang hoạt động'} : p
        );
        setPosts(updatedPosts);
        setShowPaymentModal(false);
        alert(`Thanh toán thành công cho tin #${selectedPost.id}`);
    };

    const filteredPosts = activeTab === 'all' 
        ? posts 
        : activeTab === 'active' 
            ? posts.filter(post => post.status === 'Đang hoạt động')
            : posts.filter(post => post.status.includes('hết hạn'));

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4 md:p-6">
            <Sidebar />

            <div className="w-full md:w-3/4 p-4 md:p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Danh sách tin đăng</h1>

                <div className="border-b mb-6">
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`mr-4 font-semibold border-b-2 transition ${activeTab === 'all' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Tất cả ({posts.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`mr-4 font-semibold border-b-2 transition ${activeTab === 'active' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Đang hoạt động ({posts.filter(post => post.status === 'Đang hoạt động').length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('expired')}
                        className={`mr-4 font-semibold border-b-2 transition ${activeTab === 'expired' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Hết hạn ({posts.filter(post => post.status.includes('hết hạn')).length})
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
                                <th className="p-3 border">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post, index) => (
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
                                    <td className="p-3 border text-center">
                                        {post.status.includes('hết hạn') && (
                                            <button 
                                                onClick={() => handleContinuePayment(post)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                                            >
                                                Thanh toán
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal thanh toán */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Tiếp tục thanh toán</h2>
                            <p className="mb-4">Bạn đang thanh toán để gia hạn tin đăng:</p>
                            <p className="font-semibold mb-2">Mã tin: #{selectedPost.id}</p>
                            <p className="mb-4">{selectedPost.title}</p>
                            <p className="mb-4">Phí thanh toán: <span className="font-bold text-red-500">500.000 VND</span></p>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                                >
                                    Hủy bỏ
                                </button>
                                <Link to="/post/paymentpost"
                                    
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Xác nhận thanh toán
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Posts;
"use client"

import fontawesome from "@/(icons)/fontawesome";
import { IDestinationContentList, IDestinationList } from "@/(types)/type";
import Loader from "@/app/components/Loader";
import { getDestinations } from "@/utils/(apis)/destinationApi";
import { truncateText } from "@/utils/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DestInfoForm from "./DestInfoForm";
import ConfirmModal from "@/app/components/ConfirmModal";
import PreviewModal from "./PreviewModal"; // Import the PreviewModal component
import { getDestinationsInfo } from "@/utils/(apis)/ContentApi";

const Page: React.FC = () => {
  const [contentList, setContentList] = useState<IDestinationContentList[]>([]);
  const [destinations, setDestinations] = useState<IDestinationList[]>([]);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [editObject, setEditObject] = useState<IDestinationContentList | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingDestinations, setLoadingDestinations] = useState<boolean>(true);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [viewMore, setViewMore] = useState<{ [key: string]: boolean }>({});
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false); // State for preview modal
  const [previewContent, setPreviewContent] = useState<IDestinationContentList | null>(null); // State for preview content

  const fetchData = async () => {
    try {
      const data = await getDestinationsInfo();
      setContentList(data);
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchData();
  }, [setDestinations]);

  //delete data api
  const deleteData = async (id: string) => {
    try {
      const response = await axios.delete(`/api/content/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("network error");
    }
  };

  const handleDelete = (id: string) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteData(deleteId);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  //edit data
  const handleEditOpen = (id: string) => {
    setOpenEdit(!openEdit);
    setOpenEditId(id);
    setEditObject(contentList.find((d) => d._id === id) || null);
    setOpenAddForm(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editObject === null) {
      toast.error("no available data");
      return;
    }

    const data: IDestinationContentList = {
      _id: editObject._id,
      destinationId: editObject.destinationId,
      weatherInfo: editObject.weatherInfo,
      destinationInfo: editObject.destinationInfo,
      image: editObject.image,
    };

    //check empty fields
    for (const [key, value] of Object.entries(data)) {
      if (!value) {
        toast.error("all fields are required");
        return;
      }
    }

    //submit data
    try {
      const response = await axios.put(`/api/content/${editObject._id}`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        setOpenEdit(false);
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      return toast.error("network error");
    }
  };

  const handlePublish = async (id: string) => {
    //publish code here
  };

  //search query
  const [filteredData, setFilteredData] = useState<IDestinationContentList[]>([]);

  useEffect(() => {
    setFilteredData(
      contentList.filter((item) =>
        destinations
          .find((dest) => dest._id === item.destinationId)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, contentList, destinations]);

  const handleViewMore = (id: string) => {
    setViewMore((prev) => ({ ...prev, [id]: !prev[id] }));
    setOpenEdit(false);
  };

  const handlePreview = (content: IDestinationContentList) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };

  //loader
  if (loadingContent || loadingDestinations) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-row justify-between w-full items-end">
        <input
          type="text"
          placeholder="Search destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input w-[400px]"
        />
        <button
          onClick={() => {
            setOpenAddForm(!openAddForm);
            setOpenEdit(false);
          }}
          className="bg-lightDark hover:bg-dark text-white px-4 py-2 rounded mt-2"
        >
          {openAddForm ? "Close Add Form" : "Add New Info"}
        </button>
      </div>

      {openAddForm && <DestInfoForm onSuccess={fetchData} />}

      <div className="overflow-auto mt-5">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="table-cell">Destination</th>
              <th className="table-cell">Weather Info</th>
              <th className="table-cell">Destination Info</th>
              <th className="table-cell">Image</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-cell">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-sm">No available data</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((d) => {
                const weatherInfo = truncateText(d.weatherInfo, 100);
                const destinationInfo = truncateText(d.destinationInfo, 100);
                return (
                  <React.Fragment key={d._id}>
                    <tr>
                      <td className="table-cell">
                        {destinations.find((ob) => ob._id === d.destinationId)?.name}
                      </td>
                      <td className="table-cell">
                        {viewMore[d._id] ? d.weatherInfo : weatherInfo.text}
                        {weatherInfo.truncated && (
                          <button
                            onClick={() => handleViewMore(d._id)}
                            className="bg-lightDark text-white px-3 py-1 rounded ml-2"
                          >
                            {viewMore[d._id] ? "View Less" : "View More"}
                          </button>
                        )}
                      </td>
                      <td className="table-cell">
                        {viewMore[d._id] ? d.destinationInfo : destinationInfo.text}
                        {destinationInfo.truncated && (
                          <button
                            onClick={() => handleViewMore(d._id)}
                            className="bg-lightDark text-white px-3 py-1 rounded ml-2"
                          >
                            {viewMore[d._id] ? "View Less" : "View More"}
                          </button>
                        )}
                      </td>
                      <td className="table-cell">
                        <img
                          src={d.image}
                          alt=""
                          className="w-20 h-20 transition-transform duration-300 hover:scale-125 hover:z-10"
                        />
                      </td>
                      <td className="table-cell">
                        <div className="flex flex-row justify-center gap-[30px]">
                         <button
                            onClick={() => handlePreview(d)} // Open preview modal on click
                            className="bg-blue-500 text-white px-3 py-1 rounded-[2px]"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => handleEditOpen(d._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-[2px]"
                          >
                            {openEdit && openEditId === d._id ? "Close" : "Edit"}
                          </button>
                          <button
                            onClick={() => handlePublish(d._id)}
                            className="bg-lightDark text-white px-3 py-1 rounded-[2px]"
                          >
                            Publish
                          </button>
                          <button
                            onClick={() => handleDelete(d._id)} // Open modal on click
                            className="text-red-600 text-2xl"
                          >
                            <FontAwesomeIcon icon={fontawesome.faTrashCan} />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                    {openEdit && openEditId === d._id && (
                      <tr>
                        <td colSpan={5} className="table-cell">
                          <div>
                            <form
                              onSubmit={handleSubmitEdit}
                              className="flex flex-col gap-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                            >
                              <div className="flex flex-col">
                                <label
                                  className="block text-gray-700 text-sm font-bold"
                                  htmlFor="weatherInfo"
                                >
                                  Weather Info
                                </label>
                                <textarea
                                  name="weatherInfo"
                                  id="weatherInfo"
                                  value={editObject?.weatherInfo}
                                  onChange={(e) =>
                                    setEditObject(
                                      editObject
                                        ? { ...editObject, weatherInfo: e.target.value }
                                        : null
                                    )
                                  }
                                  className="input w-full"
                                ></textarea>
                              </div>
                              <div className="flex flex-col">
                                <label
                                  className="block text-gray-700 text-sm font-bold"
                                  htmlFor="destinationInfo"
                                >
                                  Destination Info
                                </label>
                                <textarea
                                  name="destinationInfo"
                                  id="destinationInfo"
                                  value={editObject?.destinationInfo}
                                  onChange={(e) =>
                                    setEditObject(
                                      editObject
                                        ? {
                                            ...editObject,
                                            destinationInfo: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  className="input w-full"
                                ></textarea>
                              </div>
                              <div className="flex flex-col">
                                <label
                                  className="block text-gray-700 text-sm font-bold"
                                  htmlFor="imageUrl"
                                >
                                  Image Url
                                </label>
                                <input
                                  type="url"
                                  name="imageUrl"
                                  id="imageUrl"
                                  value={editObject?.image}
                                  onChange={(e) =>
                                    setEditObject(
                                      editObject
                                        ? { ...editObject, image: e.target.value }
                                        : null
                                    )
                                  }
                                  className="input"
                                />
                              </div>
                              <div className="flex flex-row w-full">
                                <button
                                  className="bg-lightDark hover:bg-[#3C4048] text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                  type="submit"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && previewContent && (
        <PreviewModal
          show={showPreviewModal} // Pass show prop
          content={previewContent} // Pass content prop
          onClose={() => setShowPreviewModal(false)} // Pass onClose prop
        />
      )}

      {/* Confirm delete */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this content?"
      />
    </div>
  );
};

export default Page;

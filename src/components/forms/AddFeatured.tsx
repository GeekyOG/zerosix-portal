import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Dropzone from "react-dropzone";
import { cn } from "../../utils/cn";
import { Image } from "lucide-react";
import Input from "../input/Input";
import { toast } from "react-toastify";
import {
  useAddFeaturedMutation,
  useGetFeaturedQuery,
  useLazyGetFeaturedQuery,
  useUpdateFeaturedMutation,
} from "../../api/featured";

interface AddFeaturedFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const AddFeaturedForm: React.FC<AddFeaturedFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");
  const [videoError, setVideoError] = useState("");
  const [video, setVideo] = useState<any>("");
  const [displaVideo, setDisplayVideo] = useState("");
  const [description, setDescription] = useState("");

  const [addFeatured, { isLoading }] = useAddFeaturedMutation();

  const [getFeatured, { data, isLoading: featuredLoading }] =
    useLazyGetFeaturedQuery();

  const [updateFeatured, { isLoading: updateLoading }] =
    useUpdateFeaturedMutation();

  useEffect(() => {
    if (id) {
      setDescription(data?.description);
      getFeatured(id)
        .unwrap()
        .then(() => {});
    }
  }, [id, featuredLoading, reset, data]);

  console.log(video);

  return (
    <div>
      {featuredLoading && id && (
        <img
          src="/dark-spinner.svg"
          alt=""
          className={cn("h-[30px] w-[30px] mx-auto mt-[100px]")}
        />
      )}
      {!featuredLoading && (
        <Formik
          initialValues={{
            image: "",
            title: data?.title || "",
            description: data?.description || "",
            videoUrl: data?.videoUrl || "",
          }}
          onSubmit={(values, { resetForm }) => {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("title", values.title);
            formData.append("description", description);
            formData.append("video", video);

            if (id) {
              updateFeatured({ body: formData, id })
                .unwrap()
                .then(() => {
                  resetForm();
                  toast.success("Action successful");
                  if (callBackAction) {
                    callBackAction();
                  }
                  resetForm();
                  setImage("");
                  setDisplay("");
                  setImageError("");
                })
                .catch((err) => {
                  toast.error(err.message ?? "Something went wrong");
                });
            }

            if (!id) {
              addFeatured(formData)
                .unwrap()
                .then(() => {
                  resetForm();
                  setDescription("");
                  toast.success("Action successful");
                  if (callBackAction) {
                    callBackAction();
                  }
                })
                .catch((err) => {
                  toast.error(err.data.msg ?? "Something went wrong");
                });
            }
          }}
        >
          {({ errors, touched, resetForm, values }) => {
            useEffect(() => {
              values.title = data?.title;
              values.description = data?.description;
              values.videoUrl = data?.videoUrl;

              if (!reset) {
                resetForm();
                setDescription("");
                setImage("");
                setDisplay("");
                setImageError("");
              }
            }, [reset, resetForm, data]);

            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <Input
                  title="Title"
                  name="title"
                  touched={touched.title}
                  errors={errors.title}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <textarea
                  className="h-[200px] w-[100%] rounded-[5px] p-[5px] border-[1px]"
                  name="description"
                  placeholder="Description"
                  onChange={(e) => {
                    values.description = e.target.value;
                    setDescription(e.target.value);
                  }}
                  value={description}
                ></textarea>

                <Dropzone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png"],
                  }}
                  onDropAccepted={(files) => {
                    setImageError("");
                    const file = files[0];
                    setImage(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      setDisplay(base64String as string);
                    };
                  }}
                  onDropRejected={() => {
                    setImageError("File size exceeds 3MB or not supported");
                  }}
                  maxSize={3000000}
                >
                  {({ getRootProps, getInputProps, acceptedFiles }) => (
                    <div className="">
                      <section>
                        <p className="text-[0.865rem] font-[500]">
                          Thumbnail Image
                        </p>
                        <div
                          {...getRootProps()}
                          className={cn(
                            "border-[1px] py-2  cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200 w-[100%]",
                            { "border-[#80F5BD] ": acceptedFiles.length > 0 }
                          )}
                        >
                          <input
                            {...getInputProps()}
                            className="absolute"
                            name="image"
                          />
                          <div className="flex items-center gap-3">
                            {display || data?.imgUrl ? (
                              <img
                                src={display || (data?.imgUrl ?? "")}
                                className="max-h-[100px] w-[100px]"
                              />
                            ) : (
                              <Image size={100} className="text-neutral-400" />
                            )}

                            <div>
                              <p className="text-[0.895rem]">
                                Upload Thumbnail Image
                              </p>

                              {display ? (
                                <div className=" w-fit rounded-[5px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0].name}
                                </div>
                              ) : (
                                <div className=" w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084] mt-2">
                                  No file Selected Yet
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {imageError && (
                          <div className="mt-2 text-sm text-red-600">
                            {imageError}
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </Dropzone>

                <Dropzone
                  accept={{
                    "video/*": [".mp4", ".mov", ".avi"],
                  }}
                  onDropAccepted={(files) => {
                    const file = files[0];

                    console.log(file);

                    setVideo(file);

                    // Handle video file similarly, if needed
                    setDisplayVideo(URL.createObjectURL(file));
                  }}
                  onDropRejected={() => {
                    setVideoError("File size exceeds 10MB or not supported");
                  }}
                  // maxSize={10000000}
                >
                  {({ getRootProps, getInputProps, acceptedFiles }) => (
                    <div className="">
                      <section>
                        <p className="text-[0.865rem] font-[500]">
                          Thumbnail Image or Video
                        </p>
                        <div
                          {...getRootProps()}
                          className={cn(
                            "border-[1px] py-2  cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200 w-[100%]",
                            { "border-[#80F5BD] ": acceptedFiles.length > 0 }
                          )}
                        >
                          <input
                            {...getInputProps()}
                            className="absolute"
                            name="video"
                          />
                          <div className="flex items-center gap-3">
                            <video
                              src={displaVideo || (data?.videoUrl ?? "")}
                              className="max-h-[100px] w-[100px]"
                              controls
                            />

                            <div>
                              <p className="text-[0.895rem]">Upload Video</p>

                              {displaVideo ? (
                                <div className="w-fit rounded-[5px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0]?.name}
                                </div>
                              ) : (
                                <div className="w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084] mt-2">
                                  No file Selected Yet
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {videoError && (
                          <div className="mt-2 text-sm text-red-600">
                            {videoError}
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </Dropzone>
                <Button isLoading={isLoading || updateLoading}>
                  Add Portfolio
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddFeaturedForm;

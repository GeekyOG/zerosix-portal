import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Dropzone from "react-dropzone";
import { cn } from "../../utils/cn";
import { Image } from "lucide-react";
import {
  useAddBrandMutation,
  useLazyGetBrandQuery,
  useUpdateBrandMutation,
} from "../../api/brandsApi";
import { toast } from "react-toastify";

interface AddBrandFormProps {
  callBackAction?: () => void;
  reset: boolean;
  id?: string;
}

function AddBrandForm({ callBackAction, id, reset }: AddBrandFormProps) {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");

  const [addBrand, { isLoading }] = useAddBrandMutation();

  const [getBrand, { isLoading: brandLoading }] = useLazyGetBrandQuery();

  const [updateBrand, { isLoading: uploadLoading }] = useUpdateBrandMutation();

  useEffect(() => {
    if (id) {
      getBrand(id)
        .unwrap()
        .then((brand) => {
          setDisplay(brand.imgUrl);
        });
    }
  }, [id, reset]);
  return (
    <div>
      <Formik
        initialValues={{
          image: "",
        }}
        onSubmit={(values, { resetForm }) => {
          const formData = new FormData();
          formData.append("image", image);

          if (id) {
            updateBrand({ body: formData, id })
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
            addBrand(formData)
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
        }}
      >
        {({ resetForm }) => {
          useEffect(() => {
            if (!reset) {
              resetForm();
              setImage("");
              setDisplay("");
              setImageError("");
            }
          }, [reset, resetForm]);
          return (
            <>
              {brandLoading && id ? (
                <img
                  src="/dark-spinner.svg"
                  alt=""
                  className={cn("h-[30px] w-[30px] mx-auto mt-[100px]")}
                />
              ) : (
                <Form encType="multipart/form-data">
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
                      <div className="flex">
                        <section>
                          <p className="text-[0.865rem] font-[500]">
                            Brand Image
                          </p>
                          <div
                            {...getRootProps()}
                            className={cn(
                              "border-[2px] py-2 cursor-pointer rounded-[10px] items-center justify-center px-2 border-neutral-200",
                              { "border-[#80F5BD]": acceptedFiles.length > 0 }
                            )}
                          >
                            <input
                              {...getInputProps()}
                              className="absolute"
                              name="image"
                            />
                            <div className="flex items-center gap-3">
                              {display ? (
                                <img
                                  src={display}
                                  className="max-h-[100px] w-[100px]"
                                />
                              ) : (
                                <Image
                                  size={100}
                                  className="text-neutral-200"
                                />
                              )}

                              <div>
                                <p className="text-[0.895rem]">
                                  Upload Brand Image
                                </p>

                                {acceptedFiles.length > 0 ? (
                                  <div className=" w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                    {acceptedFiles[0].name}
                                  </div>
                                ) : (
                                  <div className=" w-fit rounded-[10px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084]">
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
                  <Button
                    className="mt-[10px]"
                    isLoading={isLoading || uploadLoading}
                  >
                    Add Brand
                  </Button>
                </Form>
              )}
            </>
          );
        }}
      </Formik>
    </div>
  );
}

export default AddBrandForm;

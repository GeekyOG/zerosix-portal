import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { Form, Formik } from "formik";
import Dropzone from "react-dropzone";
import { cn } from "../utils/cn";
import Button from "../ui/Button";
import { useAddBrandMutation } from "../api/brandsApi";
import { toast } from "react-toastify";
import { Image } from "lucide-react";
import Input from "../components/input/Input";
import { useLazyGetLogoQuery, useUpdateLogoMutation } from "../api/logoApi";
import {
  useGetAllSocialQuery,
  useUpdateSocialMutation,
} from "../api/socialApi";

function Settings() {
  const [imageError, setImageError] = useState("");
  const [image, setImage] = useState<any>("");
  const [display, setDisplay] = useState("");

  const [updateLogo, { isLoading }] = useUpdateLogoMutation();

  const [getLogo, { data, isSuccess }] = useLazyGetLogoQuery();

  useEffect(() => {
    getLogo("");
  }, []);

  const { data: socialData } = useGetAllSocialQuery("");
  const [updateSocial, { isLoading: updateSocialLoading }] =
    useUpdateSocialMutation();
  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[2rem] font-[700]">Settings</p>
        </div>

        <div className="mt-10">
          <p className="text-[1.25rem] font-[500]">Change Logo</p>

          <Formik
            initialValues={{
              image: "",
            }}
            onSubmit={(values, { resetForm }) => {
              const formData = new FormData();
              formData.append("image", image);

              updateLogo({ body: formData, id: 1 })
                .unwrap()
                .then(() => {
                  resetForm();
                  toast.success("Action successful");
                })
                .catch((err) => {
                  toast.error(err.message ?? "Something went wrong");
                });
            }}
          >
            {() => (
              <Form encType="multipart/form-data" className="mt-3">
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
                            {isSuccess ? (
                              <img
                                src={display || data[0]?.imgUrl}
                                className="max-h-[100px] w-[100px]"
                              />
                            ) : (
                              <Image size={100} className="text-neutral-200" />
                            )}

                            <div>
                              <p className="text-[0.895rem]">Upload Logo</p>

                              {acceptedFiles.length > 0 ? (
                                <div className=" w-fit rounded-[3px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em]">
                                  {acceptedFiles[0].name}
                                </div>
                              ) : (
                                <div className=" w-fit rounded-[3px] bg-neutral-200 px-3 py-2 text-xs leading-[1.4] tracking-[-0.02em] text-[#808084]">
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
                <Button className="mt-[10px]" isLoading={isLoading}>
                  Update Logo
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <div className="mt-10">
          <p className="text-[1.25rem] font-[500]">Social Media Accounts</p>

          <div className=" max-w-[400px]">
            <Formik
              initialValues={{
                instagram: socialData ? socialData[0]?.instagram ?? "" : null,
                youtube: socialData ? socialData[0]?.youtube ?? "" : null,
                twitter: socialData ? socialData[0]?.twitter ?? "" : null,
                pinterest: socialData ? socialData[0]?.pinterest ?? "" : null,
              }}
              onSubmit={(values) => {
                updateSocial({
                  id: 1,
                  instagram: values?.instagram,
                  youtube: values?.youtube,
                  twitter: values?.twitter,
                  pinterest: values?.pinterest,
                })
                  .unwrap()
                  .then(() => {
                    toast.success("Action successful");
                  })
                  .catch((err) => {
                    toast.error(err.data.msg ?? "Something went wrong");
                  });
              }}
            >
              {({ errors, touched, values }) => {
                useEffect(() => {
                  values.instagram = socialData ? socialData[0]?.instagram : "";
                  values.youtube = socialData ? socialData[0]?.youtube : "";
                  values.twitter = socialData ? socialData[0]?.twitter : "";
                  values.pinterest = socialData ? socialData[0]?.pinterest : "";
                }, [socialData]);
                return (
                  <Form className="flex flex-col gap-[8px] mt-5">
                    <Input
                      title="Instagram"
                      errors={errors.instagram}
                      name="instagram"
                      touched={touched.instagram}
                      placeholder="Enter your email address"
                    />

                    <Input
                      title="Youtube"
                      errors={errors.youtube}
                      name="youtube"
                      touched={touched.youtube}
                      placeholder="Enter your email address"
                    />

                    <Input
                      title="Twitter"
                      errors={errors.twitter}
                      name="twitter"
                      touched={touched.twitter}
                      placeholder="Enter your email address"
                    />
                    <Input
                      title="Pinterest"
                      errors={errors.pinterest}
                      name="pinterest"
                      touched={touched.pinterest}
                      placeholder="Enter your email address"
                    />

                    <Button
                      isLoading={updateSocialLoading}
                      className="mt-[15px] h-[56px] w-[100%]"
                    >
                      <p>Submit</p>
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Settings;

import pb from "../../utils/pocketbase";

export const loginFunction = async (data) => {

  const { email, password } = data;

  const response =
  
  await pb.collection("users").authWithPassword( email,
    password, {}, {
    expand: "reference" // replace with your relation field name
})


  return response
};
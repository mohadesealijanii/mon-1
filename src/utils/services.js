import Cookies from "js-cookie";

const token = Cookies.get("authToken");
const BASE_URL = "https://stg-core.bpapp.net/api";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const submitForget = async ({ username }) => {
  const res = await fetch(
    `${BASE_URL}/Member/ForgotPassword/${username}`, // Correct use of backticks for template string
    {
      method: "POST",
      headers,
      body: JSON.stringify({ username }),
    }
  );
  return res;
};
// mohadese.alijani6@gmail.com

export const submitAccept = async ({ otp, userName, password }) => {
  const response = await fetch(`${BASE_URL}/Member/ForgotPasswordAccept`, {
    method: "POST",
    headers,
    body: JSON.stringify({ otp: otp.join(""), userName, password }),
  });
  return response;
};

export const getAllBooks = async ({ pagination }) => {
  if (!pagination) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/Book/GetBooks`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  });
  const data = await res.json();
  return data;
};

export const getAllCategories = async (pagination) => {
  const res = await fetch(`${BASE_URL}/BookCategory/GetBookCategories`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  });
  const data = await res.json();
  return data;
};

export const getAllOfTheCats = async () => {
  const res = await fetch(`${BASE_URL}/BookCategory/GetAllBookCategories`, {
    method: "GET",
    headers,
  });
  const data = await res.json();
  return data;
};

export const getBanners = async (pagination) => {
  const res = await fetch(`${BASE_URL}/Banner/GetBanners`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  });
  const data = await res.json();
  return data;
};

export const createCategory = async (title) => {
  const res = await fetch(`${BASE_URL}/BookCategory/CreateBookCategory`, {
    method: "POST",
    headers,
    body: JSON.stringify(title),
  });
  // const data = await res.json()
  return res;
};

export const deleteCategory = async (id) => {
  const res = await fetch(
    `${BASE_URL}/BookCategory/DeleteBookCategory?id=${id}&transfer=false`,
    {
      method: "GET",
      headers,
    }
  );
  return res;
};

export const getCatForUpdate = async (id) => {
  const res = await fetch(
    `${BASE_URL}/BookCategory/GetBookCategoryForUpdate?id=${id}`,
    {
      method: "GET",
      headers,
    }
  );
  const data = await res.json();
  return data;
};

export const updateCat = async (id, title) => {
  const res = await fetch(`${BASE_URL}/BookCategory/UpdateBookCategory`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, title }),
  });
  return res;
};

export const getChapters = async ({ pagination }) => {
  const res = await fetch(`${BASE_URL}/BookChapter/GetChapters`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  });
  const data = res.json();
  console.log(data);
  return data;
};

export const setOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/Book/OfferBook/${id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  return data;
};

export const changeOrder = async (id, order) => {
  const res = await fetch(`${BASE_URL}/Book/ChangeOrder`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, order }),
  });

  return res;
};

export const setFree = async (data) => {
  const res = await fetch(`${BASE_URL}/Book/FreeBook`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  return res;
};

export const getBooksAny = async (searchAny) => {
  const res = await fetch(`${BASE_URL}/Book/GetBooksAny`, {
    method: "POST",
    headers,
    body: JSON.stringify(searchAny),
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export const newComments = async ({ pagination }) => {
  const res = await fetch(`${BASE_URL}/Book/NewComment`, {
    method: "POST",
    headers,
    body: JSON.stringify(pagination),
  });
  const data = await res.json();
  return data;
};

export const changeStatusComment = async ({ commentId, status }) => {
  const res = await fetch(`${BASE_URL}/Book/ChageStatusComment`, {
    method: "POST",
    headers,
    body: JSON.stringify({ commentId, status }),
  });
  console.log(res);
  return res;
};

export const createBook = async (formData) => {
  const form = new FormData();
  form.append("Title", formData.Title);
  form.append("BookCategoryId", formData.BookCategoryId);
  form.append("Tags", formData.Tags);
  form.append("Authors", formData.Authors);
  form.append("Version", formData.Version);
  form.append("Description", formData.Description);

  try {
    const res = await fetch(`${BASE_URL}/Book/CreateBook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateBook = async ({ formData }) => {
  const form = new FormData();
  form.append("Title", formData.Title);
  form.append("BookCategoryId", formData.BookCategoryId);
  form.append("Tags", formData.Tags);
  form.append("Authors", formData.Authors);
  form.append("Version", formData.Version);
  form.append("Description", formData.Description);

  try {
    const res = await fetch(`${BASE_URL}/Book/UpdateBook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBook = async (id) => {
  const res = await fetch(`${BASE_URL}/Book/DeleteBook/${id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id }),
  });
  return res;
};

export const getBookCodes = async ({ pageSize, pageNumber, bookId }) => {
  const res = await fetch(`${BASE_URL}/BookCode/GetCodes`, {
    method: "POST",
    headers,
    body: JSON.stringify({ pageSize, pageNumber, bookId }),
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export const createChapter = async ({ formData }) => {
  const form = new FormData();
  form.append("Title", formData.Title);
  form.append("Version", formData.Version);
  form.append("BookId", formData.BookId);
  try {
    const res = await fetch(`${BASE_URL}/BookChapter/CreateChapter`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeChapterOrder = async (id, order) => {
  const res = await fetch(`${BASE_URL}/BookChapter/ChangeOrder`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id, order }),
  });

  return res;
};

export const updateChapter = async ({ formData }) => {
  const form = new FormData();
  form.append("Id", formData.Id);
  form.append("Title", formData.Title);
  form.append("BookId", formData.BookId);
  form.append("Description", formData.Description);
  form.append("Version", formData.Version);
  form.append("File", formData.File);

  try {
    const res = await fetch(`${BASE_URL}/BookChapter/UpdateChapter`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteChapter = async (id) => {
  const res = await fetch(`${BASE_URL}/BookChapter/DeleteChapter/${id}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id }),
  });
  return res;
};

export const getAssets = async (params) => {
  const res = await fetch(`${BASE_URL}/BookChapterAsset/GetAssets`, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });
  const data = res.json();
  return data;
};

export const createAsset = async (formData) => {
  const form = new FormData();
  form.append("Title", formData.Title);
  form.append("Version", formData.Version);
  form.append("FileName", formData.FileName);
  form.append("Description", formData.Description);
  form.append("Asset", formData.Asset);
  form.append("BookChapterId", formData.BookChapterId);
  try {
    const res = await fetch(`${BASE_URL}/BookChapterAsset/CreateAsset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAsset = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/BookChapterAsset/DeleteAsset/${id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(id),
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateAsset = async (formData) => {
  const form = new FormData();
  form.append("Id", formData.Id);
  form.append("Title", formData.Title);
  form.append("Version", formData.Version);
  form.append("FileName", formData.FileName);
  form.append("Description", formData.Description);
  form.append("Asset", formData.Asset);
  form.append("BookChapterId", formData.BookChapterId);
  try {
    const res = await fetch(`${BASE_URL}/BookChapterAsset/UpdateAsset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeDocOrder = async (id, order) => {
  try {
    const res = await fetch(`${BASE_URL}/BookChapterAsset/ChangeOrder`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, order }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getQuestions = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/Question/GetQuestions`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestion = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/Question/DeleteQuestion/${id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(id),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeQuesOrder = async (id, order) => {
  try {
    const res = await fetch(`${BASE_URL}/Question/ChangeOrder`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, order }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createQuestion = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/Question/CreateQuestion`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateQuestion = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/Question/UpdateQuestion`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAnswers = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/GetAnswers`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const changeAnswerOrder = async (id, order) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/ChangeOrder`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, order }),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAnswer = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/DeleteAnswer/${id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(id),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createAnswer = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/CreateAnswer`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateAnswer = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/UpdateAnswer`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const setAnswer = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/Answer/SetCorrectAnswer/${id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(id),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCodesReserve = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/BookCode/GetCodesReserve`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const generateCode = async (count) => {
  try {
    const res = await fetch(`${BASE_URL}/BookCode/GeneratorCode/${count}`, {
      method: "POST",
      headers,
      body: JSON.stringify(count),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getLogConnectedCodes = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/BookCode/GetLogConnectCodes`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getCodesRepeat = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/BookCode/GetCodesRepead`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const searchLog = async (pagination) => {
  try {
    const res = await fetch(`${BASE_URL}/Log/SearchLog`, {
      method: "POST",
      headers,
      body: JSON.stringify(pagination),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getEmailConfig = async () => {
  try {
    const res = await fetch(`${BASE_URL}/EmailConfig/GetEmailConfig`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createEmailConfig = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/EmailConfig/CreateEmailConfig`, {
      method: "POST",
      headers,
      body: JSON.stringify(formData),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSearchSetting = async () => {
  try {
    const res = await fetch(`${BASE_URL}/Setting/GetSearchSetting`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSearchSetting = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/Setting/UpdateSearchSetting`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSetting = async () => {
  try {
    const res = await fetch(`${BASE_URL}/Setting/GetSettingForUpdate`, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSetting = async (editedData) => {
  try {
    const res = await fetch(`${BASE_URL}/Setting/UpdateSetting`, {
      method: "POST",
      headers,
      body: JSON.stringify(editedData),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

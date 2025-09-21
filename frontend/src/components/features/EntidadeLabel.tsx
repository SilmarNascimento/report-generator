export type EntidadeLabelProp = {
  entidade: string;
  nomeEntidade?: string;
};

const EntidadeLabel = ({ entidade, nomeEntidade }: EntidadeLabelProp) => {
  return (
    <>
      <label htmlFor={"entidade-name"} className={`mb-2 text-sm font-bold`}>
        {entidade}
      </label>
      <p
        id="entidade-name"
        className="text-sm leading-5 font-normal tracking-[-0,125rem]"
      >
        {nomeEntidade}
      </p>
    </>
  );
};

export default EntidadeLabel;
